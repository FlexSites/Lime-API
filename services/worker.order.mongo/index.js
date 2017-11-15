const Conduit = require('@nerdsauce/conduit')
const Monk = require('monk')

const db = new Monk(process.env.MONGODB_URL)

db.addMiddleware(context => next => (args, method) => {
  if (method === 'insert') {
    if (args.data.id) {
      args.data._id = args.data.id
      delete args.data.id
    }
  }
  return next(args, method)
})
const conduit = new Conduit(process.env.AMQP_URL, { name: 'worker.order.mongo' })

const collection = db.get('order.v1', { castIds: false })

conduit
  .on('order.create.v1', async (msg) => {
    msg._id = msg.id
    delete msg.id
    return collection.insert(msg)
  })
