const uuid = require('uuid')

exports.addEventShowtime = (source, { input }, { conduit }) => {
  const { clientMutationId } = input
  input.event = input.id
  input.id = uuid.v4()
  return conduit
    .action('event.addShowtime.v1', input)
    .then(results => {
      return conduit.action('event.query.v1', { id: results.id })
        .then(([ event = {} ]) => {
          event.showtimes = [ input.timestamp ].concat(event.showtimes || [])
          return {
            clientMutationId,
            event
          }
        })
    })
}
