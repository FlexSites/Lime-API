const Conduit = require('@nerdsauce/conduit')
const Monk = require('monk')

const db = new Monk(process.env.MONGODB_URL)
const conduit = new Conduit(process.env.AMQP_URL, { name: 'service.event.addMediaconduit' })

const collection = db.get('event_source')

conduit
  .reaction('event.addMedia.v1', async (msg, message) => {
    // TODO: ACL
    console.log('service.event.addmedia', msg)
    await collection.insert(message)
    return msg
  })

console.info('service.event.addMedia listening')
