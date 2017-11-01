const PubSub = require('@nerdsauce/amqp')
const Monk = require('monk')

const { worker } = require('./worker')

worker(new Monk(process.env.MONGODB_URL), new PubSub(process.env.AMQP_URL, { name: 'stripe.order.service' }))

// FORD CREDIT
// 1212.25

// 52348580
