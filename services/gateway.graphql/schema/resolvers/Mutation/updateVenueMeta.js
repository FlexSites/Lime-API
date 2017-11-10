exports.updateVenueMeta = (source, { input }, { conduit }) => {
  const { clientMutationId, meta } = input
  return conduit
    .action('venue.updateMeta.v1', input)
    .then(results => {
      return conduit.action('venue.query.v1', { id: results.id })
        .then(([ venue = {} ]) => {
          venue.meta = meta
          return {
            clientMutationId,
            venue
          }
        })
    })
}
