const PubSub = require('@nerdsauce/conduit')
const Monk = require('monk')
const uuid = require('uuid')

// Services
// const addMedia = require('@nerdsauce/event-add-media')
// const addShowtime = require('@nerdsauce/event-add-showtime')
// const create = require('@nerdsauce/event-create')
// const disable = require('@nerdsauce/event-disable')
// const enable = require('@nerdsauce/event-enable')
const query = require('@nerdsauce/event-query')
// const remove = require('@nerdsauce/event-remove')
// const removeShowtime = require('@nerdsauce/event-remove-showtime')
// const updateMeta = require('@nerdsauce/event-update-meta')
const eventStripe = require('@nerdsauce/event.stripe')
console.log('STARTING', process.env.MONGODB_URL, process.env.AMQP_URL)

const db = new Monk(process.env.MONGODB_URL)
const logger = (context) => next => (args, method) => {
  const random = uuid.v4()
  console.time(`${method}-${random}`)
  return next(args, method)
    .then(results => {
      console.timeEnd(`${method}-${random}`)
      return results
    })
}
const amqp = new PubSub(process.env.AMQP_URL, { name: 'service.runner' })
  .middleware(logger)

async function start () {
  // await addMedia.worker(db, amqp)
  // await addShowtime.worker(db, amqp)
  // await create.worker(db, amqp)
  // await disable.worker(db, amqp)
  // await enable.worker(db, amqp)
  await query.worker(db, amqp)
  await eventStripe.worker(db, amqp)
  // await remove.worker(db, amqp)
  // await removeShowtime.worker(db, amqp)
  // await updateMeta.worker(db, amqp)
}

start()
  .catch((ex) => {
    console.error('Startup failure', ex)
  })
