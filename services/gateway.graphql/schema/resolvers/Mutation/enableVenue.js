exports.enableVenue = (source, { input }, { conduit }) => {
  const { clientMutationId } = input
  return conduit
    .action('venue.enable.v1', input)
    .then(results => {
      return conduit.action('venue.query.v1', { id: results.id })
        .then(([ venue = {} ]) => {
          venue.enabled = true
          return {
            clientMutationId,
            venue
          }
        })
    })
}
