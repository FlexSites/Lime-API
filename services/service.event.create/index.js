const Conduit = require('@nerdsauce/conduit')
const Monk = require('monk')
const get = require('lodash.get')

const db = new Monk(process.env.MONGODB_URL)
const conduit = new Conduit(process.env.AMQP_URL, { name: 'event.create' })

const collection = db.get('event_source')

conduit
  .reaction('event.create.v1', async (msg, message) => {
    const permissions = get(message, [ 'user', 'permissions' ], [])
    if (!permissions.includes('create:event')) {
      return new Error('Unauthorized. Must have permission to create events.')
    }
    await collection.insert(message)
    return msg
  })

console.info('event.create listening')
