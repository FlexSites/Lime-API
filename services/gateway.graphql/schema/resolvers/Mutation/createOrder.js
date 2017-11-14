const uuid = require('uuid')

exports.createOrder = (source, { input }, { conduit }) => {
  const { clientMutationId } = input
  input.id = uuid.v4()
  return conduit
    .action('order.create.v1', input)
    .then(results => {
      return {
        clientMutationId,
        order: results
      }
    })
}
