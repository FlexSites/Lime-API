const PubSub = require('@nerdsauce/conduit')
const Monk = require('monk')

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
const logger = ({ message, queue, exchange, connection }) => next => (args, method) => {
  console.log('GREAT LOGGING', method, args)
  return next(args, method)
}
const amqp = new PubSub(process.env.AMQP_URL)


async function start() {
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

class Worker extends PubSub {
  constructor (name, { amqp, mongodb }) {
    this.name = name
    this.amqp = amqp
    this.mongodb = mongodb
  }

  job(target, handler) {
    super.on(target, (msg) => {

    })

    return
  }
}

start()
  .catch((ex) => {
    console.error('Startup failure', ex)
  })
