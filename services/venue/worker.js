exports.worker = async (db, amqp) => {
  const write = db.get('venue_source')
  const read = db.get('venue.v1', { castIds: false })

  amqp
    .on('venue.create', async (msg) => {
      await write.insert(msg.json())
      const payload = Object.assign({}, msg.json())
      payload.type = 'created'
      payload.timestamp = Date.now()

      amqp.emit('venue.created', payload)
    })
    .on('venue.remove', async (msg) => {
      await write.insert(msg.json())
      const payload = Object.assign({}, msg.json())
      payload.type = 'removed'
      payload.timestamp = Date.now()

      amqp.emit('venue.removed', payload)
    })
    .on('venue.updateAddress', async (msg) => {
      await write.insert(msg.json())
      const payload = Object.assign({}, msg.json())
      payload.type = 'updatedAddress'
      payload.timestamp = Date.now()

      amqp.emit('venue.updatedAddress', payload)
    })
    .on('venue.updateMeta', async (msg) => {
      await write.insert(msg.json())
      const payload = Object.assign({}, msg.json())
      payload.type = 'updatedMeta'
      payload.timestamp = Date.now()

      amqp.emit('venue.updatedMeta', payload)
    })
    .on('venue.enable', async (msg) => {
      await write.insert(msg.json())
      const payload = Object.assign({}, msg.json())
      payload.type = 'enabled'
      payload.timestamp = Date.now()

      amqp.emit('venue.enabled', payload)
    })
    .on('venue.disable', async (msg) => {
      await write.insert(msg.json())
      const payload = Object.assign({}, msg.json())
      payload.type = 'disabled'
      payload.timestamp = Date.now()

      amqp.emit('venue.disabled', payload)
    })

    .on('venue.created', async (msg) => {
      const { id, payload } = msg.json()
      payload._id = id
      return read.insert(payload)
    })
    .on('venue.removed', async (msg) => {
      const { id, payload } = msg.json()
      return read.remove({ _id: id })
    })
    .on('venue.updatedAddress', async (msg) => {
      const { id, payload } = msg.json()
      return read.update({ _id: id }, { $set: { address: payload } })
    })
    .on('venue.updatedMeta', async (msg) => {
      const { id, payload } = msg.json()
      return read.update({ _id: id }, { $set: { meta: payload } })
    })
    .on('venue.enabled', async (msg) => {
      const { id, payload } = msg.json()
      return read.update({ _id: id }, { $set: { enabled: true } })
    })
    .on('venue.disabled', async (msg) => {
      const { id, payload } = msg.json()
      return read.update({ _id: id }, { $set: { enabled: false } })
    })
    .listen()
}
