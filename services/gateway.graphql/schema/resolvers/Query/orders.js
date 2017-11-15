module.exports = async (source, args, { conduit }, info) => {
  return conduit
    .action('order.query.v1', {})
    .then((orders = []) => {
      return { pageInfo: {}, edges: orders.map(order => ({ node: order })) }
    })
}
