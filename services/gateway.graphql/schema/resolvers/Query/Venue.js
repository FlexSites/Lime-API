const { toGlobalId } = require('graphql-relay')

exports.id = ({ id, _id }) => {
  return toGlobalId('Venue', _id || id)
}

exports.meta = ({ meta }) => {
  return meta || {
    title: 'Unnamed venue',
    description: 'Undescribed venue'
  }
}

exports.status = ({ enabled }) => {
  return enabled ? 'ACTIVE' : 'INACTIVE'
}
