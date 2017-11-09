const uuid = require('uuid')

exports.createEvent = (source, { input }, { conduit }) => {
  const { clientMutationId } = input
  console.log('event.create.v1', input)
  return conduit
    .action('event.create.v1', { clientMutationId, id: uuid.v4() })
    .then(results => {
      return {
        clientMutationId,
        event: results
      }
    })
    .catch((ex) => {
      console.error(ex)
    })
}
