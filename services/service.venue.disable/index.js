const Conduit = require('@nerdsauce/conduit')
const Monk = require('monk')

const db = new Monk(process.env.MONGODB_URL)
const conduit = new Conduit(process.env.AMQP_URL, { name: 'service.venue.disable' })

const write = db.get('venue_source')

conduit
  .reaction('venue.disable.v1', async (_, message) => {
    await write.insert(message)
    return { id: message.aggregate }
  })
