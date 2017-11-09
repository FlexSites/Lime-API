const uuid = require('uuid')

exports.createVenue = (source, { input }, { conduit }) => {
  const { clientMutationId } = input
  input.id = uuid.v4()
  return conduit
    .action('venue.create.v1', input)
    .then(results => {
      return {
        clientMutationId,
        venue: results
      }
    })
}
