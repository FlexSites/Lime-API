const Conduit = require('@nerdsauce/conduit')
const Monk = require('monk')

const db = new Monk(process.env.MONGODB_URL)
const conduit = new Conduit(process.env.AMQP_URL, { name: 'service.event.enable' })

const collection = db.get('event_source')

conduit
  .reaction('event.enable.v1', async (msg, message) => {
    // Who's making the request?
    // const viewer = await toViewer(msg.properties.headers.authorization)

    // Can they execute this command?
    // TODO

    // Write to source
    await collection.insert(message)
    return msg
  })
