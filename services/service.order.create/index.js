const Conduit = require('@nerdsauce/conduit')
const Monk = require('monk')

const db = new Monk(process.env.MONGODB_URL)
const conduit = new Conduit(process.env.AMQP_URL, { name: 'service.order.create' })

const collection = db.get('order_source')

conduit
  .reaction('order.create.v1', async (msg, message) => {
    await collection.insert(message)
    return msg
  })
