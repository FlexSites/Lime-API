const config = require('config')
const monk = require('monk')
const AMQP = require('@nerdsauce/amqp')

module.exports = (type, events) => {
  console.log(config.get('mongodb'))
  const db = monk(config.get('mongodb')).get(`${ type }_source`)
  const amqp = new AMQP(config.get('amqp'))

  const queue = amqp
    .exchange(type, 'topic', {})
    .queue(false, {})

  events.forEach((eventType) => queue.subscribe(`${ type }.${ eventType }`))
  queue.each(async (message) => {
    const payload = message.json()
    const { id: aggregate_id, user_id } = payload

    const { version = 0 } = await db.findOne({ aggregate_id }, { order: { version: -1 } })

    return db.insert({
      id: message.properties.messageId,

      type: eventType,
      user_id,
      aggregate_id,

      payload,

      version: version + 1,
      timestamp: message.timestamp,
    })
  })
}
