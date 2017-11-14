const Conduit = require('@nerdsauce/conduit')
const Monk = require('monk')
const { promisify } = require('util')
const get = require('lodash.get')
const Stripe = require('stripe')

const stripe = new Stripe(process.env.STRIPE_TOKEN)
const db = new Monk(process.env.MONGODB_URL)
const conduit = new Conduit(process.env.AMQP_URL, { name: 'event.query.service' })

const listProducts = promisify(stripe.products.list.bind(stripe.products))
const listSkus = promisify(stripe.skus.list.bind(stripe.skus))
const collection = db.get('event.v1', { castIds: false })

conduit
  .reaction('event.query.v1', async (msg, message) => {
    const permissions = get(message, [ 'user', 'permissions' ], [])
    if (!permissions.includes('read:event')) {
      return new Error('Unauthorized. Must have permission to read events')
    }
    const query = {}
    if (msg.id) {
      query.ids = [ msg.id ]
    }
    const { data: products } = await listProducts(query)
    const promises = products.map(async ({ id, name, description, images }) => {
      const { data: showtimes } = await listSkus({ product: id })
      return {
        id,
        meta: {
          title: name,
          description: description
        },
        image: {
          type: 'image',
          url: images[0]
        },
        showtimes: showtimes.map((showtime) => {
          return {
            id: showtime.id,
            timestamp: showtime.attributes.timestamp,
            remaining: showtime.inventory.quantity
          }
        })
      }
    })
    return Promise.all(promises)
  })

console.info('event.query listening')
