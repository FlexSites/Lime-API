const stripe = require("stripe")("sk_test_dn38vHRQy67f3prQF1Anhm4T");
const get = require('lodash.get')

exports.worker = async (db, amqp) => {
  console.log('stripe listening')
  amqp
    .on('order.created', async (msg) => {
      const { id, payload } = msg.json()
      const orderPayload = {
        currency: 'usd',
        metadata: {
          correlationId: payload.process_id,
        },
        upstream_id: payload.process_id,
        items: payload.items
          .map(({ sku, quantity }) => {
            return {
              type: 'sku',
              parent: sku,
              quantity,
            }
          }),
        email: payload.email
      }
      console.log('CREATING ORDER', JSON.stringify(orderPayload, null, 2))
      stripe.orders.create(orderPayload, async function(err, order) {
        const updatePayload = Object.assign({}, payload)
        updatePayload.payload = { id, stripe_id: order.id }
        await amqp.emit('order.linkStripe', updatePayload)
        // asynchronously called
        console.log('CREATED ORDER', err, order)
        msg.ack()
      });
    })
}
