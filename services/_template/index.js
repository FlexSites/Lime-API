const Conduit = require('@nerdsauce/conduit')
const Monk = require('monk')

const { worker } = require('./worker')

worker(new Monk(process.env.MONGODB_URL), new Conduit(process.env.AMQP_URL))
