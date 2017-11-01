const { toViewer } = require('@nerdsauce/auth')

exports.worker = async (db, amqp) => {
  const collection = db.get('event_source')

  amqp
    .on('event.removeShowtime', async (msg) => {
      console.log('removing showtime to event')
      try {
        // const viewer = await toViewer(msg.properties.headers.authorization)
        // console.log(viewer)
        // TODO: AuthZ
        // TODO: Validation
        const dbResult = await collection.insert({
          type: 'removedShowtime',
          payload: msg.json(),
          timestamp: msg.properties.timestamp
        })
        console.log('db inserted', dbResult)

        await ex.publish({
          type: 'removedShowtime',
          payload: msg.json()
        }, { routingKey: 'removedShowtime' })
      } catch (ex) {
        // TODO: Respond to client with error or nack()
        console.log('error')
        console.error(ex)
      }
    })

  console.info('EVENT REMOVE_SHOWTIME SERVICE')
}
