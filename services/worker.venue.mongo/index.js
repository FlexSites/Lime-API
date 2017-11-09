const Conduit = require('@nerdsauce/conduit')
const Monk = require('monk')

const db = new Monk(process.env.MONGODB_URL)
const conduit = new Conduit(process.env.AMQP_URL, { name: 'worker.venue.mongo' })

const read = db.get('venue.v1', { castIds: false })

conduit
  .on('venue.create.v1', async (msg) => {
    console.log('VENUE CREATED!!!', msg)
    msg._id = msg.id
    delete msg.id
    const dbResults = await read.insert(msg)
    console.log('saved to venue.v1', dbResults)
    return msg
  })
  .on('venue.remove.v1', async ({ id }) => {
    return read.remove({ _id: id })
  })
  .on('venue.updateAddress.v1', async ({ id, address }) => {
    return read.update({ _id: id }, { $set: { address } })
  })
  .on('venue.updateMeta.v1', async ({ id, meta }) => {
    return read.update({ _id: id }, { $set: { meta } })
  })
  .on('venue.enable.v1', async ({ id }) => {
    return read.update({ _id: id }, { $set: { enabled: true } })
  })
  .on('venue.disable.v1', async ({ id }) => {
    return read.update({ _id: id }, { $set: { enabled: false } })
  })

console.info('worker.venue.mongo listening')
