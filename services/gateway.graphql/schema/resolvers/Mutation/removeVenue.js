exports.removeVenue = (source, { input }, { conduit }) => {
  return conduit
    .action('venue.remove.v1', input)
    .then(results => {
      return {
        clientMutationId: input.clientMutationId,
        venue: {
          id: input.id
        }
      }
    })
}
