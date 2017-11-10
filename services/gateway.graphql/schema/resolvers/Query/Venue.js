
exports.id = ({ id, _id }) => {
  return id || _id
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
