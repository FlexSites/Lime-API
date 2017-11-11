const Conduit = require('@nerdsauce/conduit')
const Monk = require('monk')

const db = new Monk(process.env.MONGODB_URL)
const conduit = new Conduit(process.env.AMQP_URL, { name: 'event.mongo.worker' })

const collection = db.get('event.v1', { castIds: false })

conduit
  .on('event.create.v1', async (msg) => {
    msg._id = msg.id
    delete msg.id
    return collection.insert(msg)
  })
  .on('event.addMedia.v1', async ({ id, url }) => {
    const event = await collection.findOne({ _id: id })
    const media = event.media || []
    media.push({ type: 'image', url })
    return collection.update({ _id: id }, { $set: { media } })
  })
  .on('event.addShowtime.v1', async ({ id, timestamp }) => {
    const event = await collection.findOne({ _id: id })
    const showtimes = event.showtimes || []
    showtimes.push({ timestamp })
    return collection.update({ _id: id }, { $set: { showtimes } })
  })
  .on('event.removeShowtime.v1', async (msg) => {
    const event = await collection.findOne({ _id: msg.id })
    const showtimes = (event.showtimes || []).filter((showtime) => {
      return showtime.timestamp !== msg.timestamp
    })
    return collection.update({ _id: msg.id }, { $set: { showtimes } })
  })
  .on('event.enable.v1', async (msg) => {
    return collection.update({ _id: msg.id }, { $set: { enabled: true } })
  })
  .on('event.disable.v1', async (msg) => {
    return collection.update({ _id: msg.id }, { $set: { enabled: false } })
  })
  .on('event.remove.v1', async (msg) => {
    return collection.remove({ _id: msg.id })
  })
  .on('event.updateMeta.v1', async (msg) => {
    return collection.update({ _id: msg.id }, { $set: {
      'meta.title': msg.meta.title,
      'meta.description': msg.meta.description
    } })
  })

console.info('worker.event.mongo listening')
