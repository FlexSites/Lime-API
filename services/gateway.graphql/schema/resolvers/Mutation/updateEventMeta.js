const { fromGlobalId } = require('graphql-relay')

exports.updateEventMeta = (source, { input }, { conduit }) => {
  const { clientMutationId, meta } = input
  input.id = fromGlobalId(input.id).id
  return conduit
    .action('event.updateMeta.v1', input)
    .then(results => {
      return conduit.action('event.query.v1', { id: results.id })
        .then(([ event = {} ]) => {
          event.meta = meta
          return {
            clientMutationId,
            event
          }
        })
    })
}
