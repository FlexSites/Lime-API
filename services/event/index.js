const PubSub = require('@nerdsauce/amqp/pubsub')
const Monk = require('monk')

// Services
const addMedia = require('@nerdsauce/event-add-media')
const addShowtime = require('@nerdsauce/event-add-showtime')
const create = require('@nerdsauce/event-create')
const disable = require('@nerdsauce/event-disable')
const enable = require('@nerdsauce/event-enable')
const query = require('@nerdsauce/event-query')
const remove = require('@nerdsauce/event-remove')
const removeShowtime = require('@nerdsauce/event-remove-showtime')
const updateMeta = require('@nerdsauce/event-update-meta')

console.log('STARTING', process.env.MONGODB_URL, process.env.AMQP_URL)

const db = new Monk(process.env.MONGODB_URL)

function onMessage(msg) {
  msg.reply = function (response) {
    if (msg.properties.replyTo) {
      return this
        .queue(msg.properties.replyTo, { durable: false })
        .publish(response, { correlationId: msg.properties.correlationId })
    }
    return response
  }
  return msg
}

async function start() {
  await addMedia.worker(db, new PubSub(process.env.AMQP_URL, { onMessage, name: 'event.addMedia.service' }))
  await addShowtime.worker(db, new PubSub(process.env.AMQP_URL, { onMessage, name: 'event.addShowtime.service' }))
  await create.worker(db, new PubSub(process.env.AMQP_URL, { onMessage, name: 'event.create.service' }))
  await disable.worker(db, new PubSub(process.env.AMQP_URL, { onMessage, name: 'event.disable.service' }))
  await enable.worker(db, new PubSub(process.env.AMQP_URL, { onMessage, name: 'event.enable.service' }))
  await query.worker(db, new PubSub(process.env.AMQP_URL, { onMessage, name: 'event.query.service' }))
  await remove.worker(db, new PubSub(process.env.AMQP_URL, { onMessage, name: 'event.remove.service' }))
  await removeShowtime.worker(db, new PubSub(process.env.AMQP_URL, { onMessage, name: 'event.removeShowtime.service' }))
  await updateMeta.worker(db, new PubSub(process.env.AMQP_URL, { onMessage, name: 'event.updateMeta.service' }))
}

start()
  .catch((ex) => {
    console.error('Startup failure', ex)
  })
