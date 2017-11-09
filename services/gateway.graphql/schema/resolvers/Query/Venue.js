
exports.id = ({ id, _id }) => {
  return id || _id
}

exports.meta = ({ meta }) => {
  return meta || {
    title: 'Unnamed venue',
    description: 'Undescribed venue'
  }
}
