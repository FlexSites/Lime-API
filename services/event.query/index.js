const PubSub = require('@nerdsauce/conduit')
const Monk = require('monk')

const { worker } = require('./worker')

console.info('Starting event query service', process.env.MONGODB_URL, process.env.AMQP_URL)

worker(new Monk(process.env.MONGODB_URL), new PubSub(process.env.AMQP_URL, 'event.query.service'))
