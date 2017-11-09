const Conduit = require('@nerdsauce/conduit')
const Monk = require('monk')
const get = require('lodash.get')

const db = new Monk(process.env.MONGODB_URL)
const conduit = new Conduit(process.env.AMQP_URL, { name: 'venue.create.service' })

const write = db.get('venue_source')


conduit
  .reaction('venue.create.v1', async (msg, message) => {
    console.log('venue.create.v1', msg, message)
    const permissions = get(message, [ 'user', 'permissions' ], [])
    if (!permissions.includes('create:venue')) {
      return new Error('Unauthorized. Must have permission to create venues')
    }
    await write.insert(message)

    return msg
  })

console.info('venue.create.service listening')
