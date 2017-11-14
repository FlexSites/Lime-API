const { fromGlobalId, toGlobalId } = require('graphql-relay')

exports.node = (source, args, { conduit }) => {
  const { type, id } = fromGlobalId(args.id)
  return conduit.action(`${type.toLowerCase()}.query.v1`, { id })
    .then(results => {
      if (Array.isArray(results) && results.length) {
        const node = results[0]
        node.id = toGlobalId(type, node.id)
        return node
      }
      return new Error(`${type} with ID ${id} not found.`)
    })
}
