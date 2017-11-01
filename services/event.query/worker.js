const { promisify } = require('util')
const stripe = require('stripe')(
  'sk_test_dn38vHRQy67f3prQF1Anhm4T'
)

const listProducts = promisify(stripe.products.list.bind(stripe.products))

exports.worker = (db, amqp) => {
  const collection = db.get('event.v1', { castIds: false })

  amqp
    .reaction('event.query.v1', async (msg) => {
      const { data } = await listProducts()
      return data
    })

  console.info('EVENT QUERY SERVICE')

  return collection
}
