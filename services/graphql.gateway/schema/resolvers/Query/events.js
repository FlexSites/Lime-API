module.exports = async (source, args, { conduit }, info) => {
  console.time('event.query.v1')
  return conduit
    .action('event.query.v1', {})
    .then((data = []) => {
      console.timeEnd('event.query.v1')
      return { pageInfo: {}, edges: data.map(product => ({ node: product })) }
    })
}
