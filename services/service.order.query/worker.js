exports.worker = async (db, amqp) => {
  const collection = db.get('order_source')
  const read = db.get('order.v1', { castIds: false })
  amqp
    .on('order.create', async (msg) => {
      const payload = Object.assign({}, msg.json())
      await collection.insert(payload)
      payload.type = 'created'
      payload.timestamp = Date.now()
      return await amqp.emit('order.created', payload)
    })
    .on('order.created', async (msg) => {
      const { payload } = msg.json()
      payload._id = payload.id
      delete payload.id
      return read.insert(payload)
    })
    .on('order.linkStripe', async (msg) => {
      const data = msg.json()
      const { payload } = data
      return read.update({ _id: data.id }, { $set: { stripe_id: payload.stripe_id } })
    })
}
