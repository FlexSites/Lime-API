const { toViewer } = require('@nerdsauce/auth')

exports.worker = async (db, amqp) => {
  const collection = db.get('event_source')
  amqp
    .on('event.enable', async (msg) => {
      console.log('enabling event')
      // Who's making the request?
      // const viewer = await toViewer(msg.properties.headers.authorization)

      // Can they execute this command?
      // TODO

      // Write to source
      await collection.insert({
        type: 'enabled',
        payload: msg.json(),
        timestamp: msg.properties.timestamp
      })

      // Alert interested parties about changes
      return await ex.publish({
        type: 'enabled',
        payload: msg.json(),
      }, { routingKey: 'enabled', timestamp: msg.properties.timestamp })
    })
    .listen()

  console.log('EVENT ENABLE SERVICE')
}
