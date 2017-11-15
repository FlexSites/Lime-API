const Conduit = require('@nerdsauce/conduit')
const { promisify } = require('util')
const Stripe = require('stripe')
const { debug } = require('@nerdsauce/conduit/middleware/debug')

const stripe = new Stripe(process.env.STRIPE_TOKEN)
const conduit = new Conduit(process.env.AMQP_URL, { name: 'service.order.query' })

const listOrders = promisify(stripe.orders.list.bind(stripe.orders))

conduit
  .middleware(debug)
  .middleware(context => next => (args, method) => {
    return next(args, method)
      .catch(ex => console.error(ex))
  })
  .reaction('order.query.v1', async (msg, message) => {
    console.log('order.query.v1')
    const { data: orders } = await listOrders(msg)
    return orders
      .map(({ amount, id, items, created, email, status }) => {
        const tickets = [].concat(
          ...items
            .filter(({ type }) => type === 'sku')
            .map(item => {
              return new Array(item.quantity).fill({
                id: id,
                order_id: id,
                type: 'GA'
              })
            })
        )
        return {
          id: id,
          created: created,
          amount,
          status,
          user: { email },
          amount,
          tickets
        }
      })
  })
