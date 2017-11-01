const AMQP = require('@nerdsauce/amqp')

module.exports = url => {
  const amqp = new AMQP(url)
  return type => action => (payload, options) => {
    // Validate payload structure
    return amqp
      .exchange(type, 'topic', { durable: true })
      .publish(`${type}.${action}`, payload, Object.assign({ routingKey: action }, options))
  }
}
