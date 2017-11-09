
exports.id = ({ id, _id }) => {
  return _id || id
}

exports.meta = (source) => {
  return {
    title: source.name,
    description: source.description
  }
}

exports.showtimes = async (source, args, context, info) => {
  console.log('LISTING SKUS', source.id)
  const { data } = source.skus

  return data.map((showtime) => {
    console.log('SHOWTIME', showtime)
    return {
      id: showtime.id,
      timestamp: showtime.attributes.timestamp,
      remaining: showtime.inventory.quantity
    }
  })
}