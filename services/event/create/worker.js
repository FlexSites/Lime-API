const { toViewer } = require('@nerdsauce/auth')

const commit = (ex, type) => (user_id, request_id) => (aggregate_id, payload) => {
  const message = {
    type,
    user_id,
    process_id,
    aggregate_id,
    payload,
    timestamp: Date.now(),
  }
  return ex.publish(payload, { routingKey: payload.type, timestamp: payload.timestamp })
}

exports.worker = async (db, amqp) => {
  const collection = db.get('event_source')

  amqp
    .on('event.create', async (msg) => {
      console.log('creating event')
      try {
        // const viewer = await toViewer(msg.properties.headers.authorization)
        // console.log('viewer viewer viewer', viewer)
        // TODO: AuthZ
        // TODO: Validation
        const dbResult = await collection.insert({
          type: 'created',
          payload: msg.json(),
          timestamp: msg.properties.timestamp
        })
        console.log('db inserted', dbResult)

        const created = msg.json()
        created.type = 'created'
        created.timestamp = Date.now()

        await amqp.emit('event.created', created)
        msg.ack()
      } catch (ex) {
        msg.nack()
        // TODO: Respond to client with error or nack()
        console.log('error')
        console.error(ex)
      }
    })
    .listen()

  console.info('EVENT CREATE SERVICE')
}
