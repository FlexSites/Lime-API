const Conduit = require('@nerdsauce/conduit')
const Monk = require('monk')

const { worker } = require('./worker')

console.info('Starting event query service', process.env.MONGODB_URL, process.env.AMQP_URL)

worker(new Monk(process.env.MONGODB_URL), new Conduit(process.env.AMQP_URL, { name: 'event.query.service' })
