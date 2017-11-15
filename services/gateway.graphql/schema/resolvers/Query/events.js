module.exports = async (source, args, { conduit }, info) => {
  return conduit
    .action('event.query.v1', {})
    .then((data = []) => {
      return { pageInfo: {}, edges: data.map(product => ({ node: product })) }
    })
}
