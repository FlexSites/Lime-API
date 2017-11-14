const uuid = require('uuid')
const { fromGlobalId } = require('graphql-relay')

exports.createEvent = (source, { input }, { conduit }) => {
  const { clientMutationId, venue_id } = input
  const { id } = fromGlobalId(venue_id)
  return conduit
    .action('event.create.v1', { clientMutationId, id: uuid.v4(), venue_id: id })
    .then(results => {
      return {
        clientMutationId,
        event: results
      }
    })
}
