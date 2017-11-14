const { fromGlobalId } = require('graphql-relay')

exports.enableEvent = (source, { input }, { conduit }) => {
  const { clientMutationId } = input
  input.id = fromGlobalId(input.id).id
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
