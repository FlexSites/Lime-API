const AMQP = require('@nerdsauce/amqp')

module.exports = url => {
  const amqp = new AMQP(url)
  return type => action => (payload, options) => {
    // Validate payload structure

    return amqp
      .exchange(type, 'topic', { durable: true })
      .publish(`${ type }.${ action }`, payload, Object.assign({ routingKey: action }, options))
  }
}

// {
//   aggregate_id: '1234',
//   timestamp: 12345,
//   user_id: '12345',
//   version: 1,
//   process_id: 12345,
// }
