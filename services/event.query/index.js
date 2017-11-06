const Conduit = require('@nerdsauce/conduit')
const Monk = require('monk')
const { promisify } = require('util')
const get = require('lodash.get')
const Stripe = require('stripe')

const stripe = new Stripe(process.env.STRIPE_TOKEN)
const db = new Monk(process.env.MONGODB_URL)
const conduit = new Conduit(process.env.AMQP_URL, { name: 'event.query.service' })

const listProducts = promisify(stripe.products.list.bind(stripe.products))
const collection = db.get('event.v1', { castIds: false })

conduit
  .reaction('event.query.v1', async (_, message) => {
    const permissions = get(message, [ 'user', 'permissions' ], [])
    if (permissions.includes('read:event')) {
      const { data } = await listProducts()
      return data
    }
    return new Error('Unauthorized. Must have permission to read events')
  })

console.info('event.query listening')
