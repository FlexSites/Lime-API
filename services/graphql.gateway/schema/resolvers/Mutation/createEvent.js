const uuid = require('uuid')

exports.createEvent = (source, { clientMutationId }, { conduit }) => {
  return conduit
    .action('event.create.v1', { clientMutationId, id: uuid.v4() })
    .then(results => {
      return {
        clientMutationId,
        event: results,
      }
    })
}
