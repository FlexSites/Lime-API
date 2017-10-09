const { toViewer } = require('@nerdsauce/auth')

exports.worker = async (db, amqp) => {
  const collection = db.get('event_source')

  amqp
    .on('event.addShowtime', async (msg) => {
      console.log('adding showtime to event')
      try {
        // const viewer = await toViewer(msg.properties.headers.authorization)
        // console.log(viewer)
        // TODO: AuthZ
        // TODO: Validation
        const dbResult = await collection.insert({
          type: 'addedShowtime',
          payload: msg.json(),
          timestamp: msg.properties.timestamp
        })
        console.log('db inserted', dbResult)
        await amqp.emit('event.addedShowtime', msg.json())
      } catch (ex) {
        // TODO: Respond to client with error or nack()
        console.log('error')
        console.error(ex)
      }
    })
    .listen()

  console.info('EVENT ADD_SHOWTIME SERVICE')
}
