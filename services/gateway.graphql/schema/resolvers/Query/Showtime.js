const { toGlobalId } = require('graphql-relay')

exports.id = ({ id, _id }) => {
  return toGlobalId('Showtime', _id || id)
}
