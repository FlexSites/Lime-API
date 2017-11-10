const Conduit = require('@nerdsauce/conduit')
const Monk = require('monk')
const get = require('lodash.get')

const db = new Monk(process.env.MONGODB_URL)
const conduit = new Conduit(process.env.AMQP_URL, { name: 'venue.updateMeta.service' })

const write = db.get('venue_source')


conduit
  .reaction('venue.updateMeta.v1', async (msg, message) => {
    const permissions = get(message, [ 'user', 'permissions' ], [])
    if (!permissions.includes('update:meta')) {
      return new Error('Unauthorized. Must have permission to update venue metadata')
    }
    await write.insert(message)

    return msg
  })

console.info('service.venue.updateMeta listening')
