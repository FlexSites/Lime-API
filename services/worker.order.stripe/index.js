const Conduit = require('@nerdsauce/conduit')
const { promisify } = require('util')
const Stripe = require('stripe')

const stripe = new Stripe(process.env.STRIPE_TOKEN)
const conduit = new Conduit(process.env.AMQP_URL, { name: 'worker.order.stripe' })

const createOrder = promisify(stripe.orders.create.bind(stripe.orders))
const payOrder = promisify(stripe.orders.pay.bind(stripe.orders))

conduit
  .on('order.create.v1', async (msg) => {
    // Create the product
    const order = await createOrder({
      currency: 'USD',
      email: msg.email,
      items: msg.items.map((item) => {
        return {
          type: 'sku',
          parent: item.sku,
          quantity: item.quantity
        }
      })
    })
    const results = await payOrder(order.id, {
      [order.customer ? 'customer' : 'source']: order.customer || msg.payment.source,
      metadata: {
        aggregate_id: msg.id
      }
    })
    await msg.emit('stripe.paid.v1', results)
    return results
  })
