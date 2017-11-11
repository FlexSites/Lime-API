exports.disableEvent = (source, { input }, { conduit }) => {
  const { clientMutationId } = input
  return conduit
    .action('event.disable.v1', input)
    .then(results => {
      return conduit.action('event.query.v1', { id: results.id })
        .then(([ event = {} ]) => {
          event.disabled = true
          return {
            clientMutationId,
            event
          }
        })
    })
}
