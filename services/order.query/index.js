const AMQP = require('@nerdsauce/amqp')
const Monk = require('monk')

const { worker } = require('./worker')

worker(new Monk(process.env.MONGODB_URL), new AMQP(process.env.AMQP_URL, { name: 'order.create.service' }))
