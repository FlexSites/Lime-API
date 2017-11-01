const stripe = require("stripe")("sk_test_dn38vHRQy67f3prQF1Anhm4T");
const get = require('lodash.get')

exports.worker = async (db, amqp) => {
  console.log('stripe listening')
  amqp
    .on('event.created', async (msg) => {
      console.log('STRIPE PAYLOAD', msg.fields.routingKey)
      const { payload } = msg.json()
      console.log('STRIPE', payload)
      // Create the product
      stripe.products.create({
        id: payload.id,
        name: get(payload, 'meta.title', 'Untitled Event'),
        description: get(payload, 'meta.description', 'Event Description'),
        // These are the characteristics of the product that SKUs provide values for
        attributes: ['timestamp'],
        shippable: false,
      }, function(err, product) {
        // asynchronously called
        console.log('created product', err, product)
        msg.ack()
      });
    })
    .on('event.addedShowtime', async (msg) => {
      const { id, payload } = msg.json()
      console.log('SHOWTIME PAYLOAD', payload)
      stripe.skus.create({
        product: id,
        attributes: {
          timestamp: payload.timestamp,
        },
        price: 1500,
        currency: 'usd',
        inventory: {
          type: 'finite',
          quantity: 500
        },
      }, function(err, sku) {
        // asynchronously called
        console.log('sku created', err, sku)
        msg.ack()
      });
    })
}
