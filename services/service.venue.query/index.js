const Conduit = require('@nerdsauce/conduit')
const Monk = require('monk')

const db = new Monk(process.env.MONGODB_URL)
const conduit = new Conduit(process.env.AMQP_URL, { name: 'service.venue.query' })

const read = db.get('venue.v1', { castIds: false })

conduit
  .reaction('venue.query.v1', async (msg, { user }) => {
    return read.find({})
  })
