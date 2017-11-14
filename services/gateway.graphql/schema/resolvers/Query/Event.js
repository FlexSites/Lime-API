const { toGlobalId } = require('graphql-relay')
exports.id = ({ id, _id }) => {
  return toGlobalId('Event', _id || id)
}
