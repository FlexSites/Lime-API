const Conduit = require('@nerdsauce/conduit')
const Monk = require('monk')
const get = require('lodash.get')

const db = new Monk(process.env.MONGODB_URL)
const conduit = new Conduit(process.env.AMQP_URL, { name: 'service.venue.updateAddress' })

const write = db.get('venue_source')

conduit
  .reaction('venue.updateAddress.v1', async (msg, message) => {
    const permissions = get(message, [ 'user', 'permissions' ], [])
    if (!permissions.includes('remove:venue')) {
      return new Error('Unauthorized. Must have permission to remove venues')
    }
    await write.insert(message)
    return msg
  })
