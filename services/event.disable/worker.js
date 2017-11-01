const { toViewer } = require('@nerdsauce/auth')

exports.worker = async (db, amqp) => {
  const collection = db.get('event_source')

  amqp
    .on('event.disable', async (msg) => {
      console.log('enabling event')
      // Who's making the request?
      // const viewer = await toViewer(msg.properties.headers.authorization)

      // Can they execute this command?
      // TODO

      // Write to source
      await collection.insert({
        type: 'disabled',
        payload: msg.json(),
        timestamp: msg.properties.timestamp
      })

      // Alert interested parties about changes
      await amqp.emit('event.disabled', msg.json())
    })

  console.log('EVENT DISABLE SERVICE')
}
