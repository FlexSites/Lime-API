const { toViewer } = require('@nerdsauce/auth')

exports.worker = async (db, amqp) => {
  const ex = amqp.exchange('event', 'topic', { durable: true })
  const collection = db.get('event_source')

  ex
    .queue('event.remove.service', { durable: true })
    .subscribe('remove')
    .each(async (msg) => {
      console.log('removing event')
      // Who's making the request?
      // const viewer = await toViewer(msg.properties.headers.authorization)

      // Can they execute this command?
      // TODO

      // Write to source
      await collection.insert({
        type: 'removed',
        payload: msg.json(),
        timestamp: msg.properties.timestamp
      })

      // Alert interested parties about changes
      await ex.publish({
        type: 'removed',
        payload: msg.json(),
      }, { routingKey: 'removed', timestamp: msg.properties.timestamp })
    })

  console.log('EVENT REMOVE SERVICE')
}
