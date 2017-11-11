const Conduit = require('@nerdsauce/conduit')
const Monk = require('monk')

const db = new Monk(process.env.MONGODB_URL)
const conduit = new Conduit(process.env.AMQP_URL)

conduit
  // .on('resource.action.version', handler)
  // .reaction('resource.action.version', handler)
  // .action('resource.action.version', payload)
