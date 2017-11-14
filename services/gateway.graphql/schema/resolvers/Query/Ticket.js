const { toGlobalId } = require('graphql-relay')

exports.id = ({ id, _id }) => {
  return toGlobalId('Ticket', _id || id)
}
