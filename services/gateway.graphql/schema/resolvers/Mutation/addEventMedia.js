exports.addEventMedia = (source, { input }, { conduit }) => {
  const { clientMutationId } = input
  return conduit
    .action('event.addMedia.v1', input)
    .then(results => {
      return conduit.action('event.query.v1', { id: results.id })
        .then(([ event = {} ]) => {
          event.media = [ input.url ].concat(event.media || [])
          return {
            clientMutationId,
            event
          }
        })
    })
}
