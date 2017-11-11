exports.disableVenue = (source, { input }, { conduit }) => {
  const { clientMutationId } = input
  return conduit
    .action('venue.disable.v1', input)
    .then(results => {
      return conduit.action('venue.query.v1', { id: results.id })
        .then(([ venue = {} ]) => {
          venue.enabled = false
          return {
            clientMutationId,
            venue
          }
        })
    })
}
