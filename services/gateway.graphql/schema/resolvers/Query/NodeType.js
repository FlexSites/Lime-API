const { fromGlobalId } = require('graphql-relay')

exports.__resolveType = ({ id, _id }, args) => {
  try {
    const { type } = fromGlobalId(id || _id)
    return type
  } catch (ex) {
    return 'Event'
  }
}
