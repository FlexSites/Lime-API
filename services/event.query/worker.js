const { promisify } = require('util')
const get = require('lodash.get')
const Stripe = require('stripe')

exports.worker = (db, amqp) => {
  const stripe = new Stripe(process.env.STRIPE_TOKEN)
  const listProducts = promisify(stripe.products.list.bind(stripe.products))
  const collection = db.get('event.v1', { castIds: false })
  amqp
    .reaction('event.query.v1', async (_, message) => {
      const permissions = get(message, [ 'user', 'permissions' ], [])
      if (permissions.includes('read:event')) {
        const { data } = await listProducts()
        return data
      }
      return new Error('Unauthorized. Must have permission to read events')
    })

  console.info('event.query listening')

  return collection
}
