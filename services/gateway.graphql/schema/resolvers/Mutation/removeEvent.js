exports.removeEvent = (source, { input }, { conduit }) => {
  const { clientMutationId } = input
  return conduit
    .action('event.remove.v1', input)
    .then(results => {
      return conduit.action('event.query.v1', { id: results.id })
        .then(([ event = {} ]) => {
          return {
            clientMutationId,
            event
          }
        })
    })
}
