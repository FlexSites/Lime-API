const Conduit = require('@nerdsauce/conduit')
const Monk = require('monk')

const db = new Monk(process.env.MONGODB_URL)
const conduit = new Conduit(process.env.AMQP_URL, { name: 'service.event.addShowtime'})

const collection = db.get('event_source')

conduit
  .reaction('event.addShowtime.v1', async (msg, message) => {
    // const viewer = await toViewer(msg.properties.headers.authorization)
    // TODO: AuthZ
    // TODO: Validation
    await collection.insert(message)
    return msg
  })

console.info('service.event.addShowtime listening')
