const { makeExecutableSchema, addMockFunctionsToSchema } = require('graphql-tools')
const definitions = require('./definitions')
const resolveTree = require('./resolvers')

module.exports = async () => {
  const typeDefs = await definitions()
  const resolvers = await resolveTree()
  const schema = makeExecutableSchema({ typeDefs, resolvers })

  if (process.env.NODE_ENV === 'mock') {
    const mocks = require('./mocks')
    addMockFunctionsToSchema({ schema, mocks, preserveResolvers: true })
  }

  return schema
}
