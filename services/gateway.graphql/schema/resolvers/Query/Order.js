const { toGlobalId } = require('graphql-relay')

exports.id = ({ id, _id }) => {
  return toGlobalId('Order', _id || id)
}
