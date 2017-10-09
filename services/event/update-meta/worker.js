const { toViewer } = require('@nerdsauce/auth')

exports.worker = async (db, amqp) => {
  const collection = db.get('event_source')
  amqp
    .on('event.updateMeta', async (msg) => {
      console.log('updating event meta information')
      try {
        // const viewer = await toViewer(msg.properties.headers.authorization)
        // console.log(viewer)
        // TODO: AuthZ
        // TODO: Validation
        const dbResult = await collection.insert({
          type: 'updatedMeta',
          payload: msg.json(),
          timestamp: msg.properties.timestamp
        })
        console.log('db inserted', dbResult)

        await ex.publish({
          type: 'updatedMeta',
          payload: msg.json()
        }, { routingKey: 'updatedMeta' })
      } catch (ex) {
        // TODO: Respond to client with error or nack()
        console.log('error')
        console.error(ex)
      }
    })
    .listen()

  console.info('EVENT UPDATE_META SERVICE')
}
