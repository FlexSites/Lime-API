exports.worker = (db, amqp) => {
  const collection = db.get('event.v1', { castIds: false })

  amqp
    .on('event.created', async (msg) => {
      const payload = msg.json().payload
      payload._id = payload.id
      delete payload.id
      return collection.insert(payload, { castIds: false })
    })
    .on('event.addedShowtime', async (msg) => {
      const event = await collection.findOne({ _id: msg.json().payload.id })
      const showtimes = event.showtimes || []
      showtimes.push({ timestamp: msg.json().payload.timestamp })
      return collection.update({ _id: msg.json().payload.id }, { $set: { showtimes } })
    })
    .on('event.removedShowtime', async (msg) => {
      const event = await collection.findOne({ _id: msg.json().payload.id })
      const showtimes = (event.showtimes || []).filter((showtime) => {
        return showtime.timestamp !== msg.json().payload.timestamp
      })
      return collection.update({ _id: msg.json().payload.id }, { $set: { showtimes } })
    })
    .on('event.enabled', async (msg) => {
      return collection.update({ _id: msg.json().payload.id }, { $set: { enabled: true } })
    })
    .on('event.disabled', async (msg) => {
      return collection.update({ _id: msg.json().payload.id }, { $set: { enabled: false } })
    })
    .on('event.removed', async (msg) => {
      return collection.remove({ _id: msg.json().payload.id })
    })
    .on('event.updatedMeta', async (msg) => {
      return collection.update({ _id: msg.json().payload.id }, { $set: {
        'meta.title': msg.json().payload.meta.title,
        'meta.description': msg.json().payload.meta.description
      } })
    })
    .on('event.query', async (msg) => {
      const query = msg.json()
      const results = await collection.find(query)
      msg.reply(results)
      return results
    })

  console.info('EVENT QUERY SERVICE')

  return collection
}
