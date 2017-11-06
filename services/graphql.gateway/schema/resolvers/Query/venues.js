module.exports = async (source, args, { conduit }, info) => {
  return conduit.action('venue.query.v1', {})
    .then((venues) => {
      return { pageInfo: {}, edges: venues.map(venue => ({ node: venue })) }
    })
}
