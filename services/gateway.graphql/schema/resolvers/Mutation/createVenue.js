const uuid = require('uuid')

exports.createVenue = (source, { input }, { conduit }) => {
  const { clientMutationId } = input
  console.log('venue.create.v1', input)
  return conduit
    .action('venue.create.v1', { clientMutationId, id: uuid.v4() })
    .then(results => {
      console.log('venue.created', results)
      return {
        clientMutationId,
        venue: results
      }
    })
    .catch((ex) => {
      console.error('my horrible error!', ex)
      throw ex
    })
}
