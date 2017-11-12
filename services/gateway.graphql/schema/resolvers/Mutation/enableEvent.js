exports.enableEvent = (source, { input }, { conduit }) => {
  const { clientMutationId } = input
  return conduit
    .action('event.enable.v1', input)
    .then(results => {
      return conduit.action('event.query.v1', { id: results.id })
        .then(([ event = {} ]) => {
          event.enabled = true
          return {
            clientMutationId,
            event
          }
        })
    })
}
