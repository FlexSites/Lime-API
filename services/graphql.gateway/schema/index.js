const { makeExecutableSchema, addMockFunctionsToSchema } = require('graphql-tools')
const mocks = require('./mocks')
const definitions = require('./definitions')
const resolveTree = require('./resolvers')

module.exports = async () => {
  const typeDefs = await definitions()
  const resolvers = await resolveTree()
  const schema = makeExecutableSchema({ typeDefs, resolvers })

  if (process.env.NODE_ENV === 'mock') {
    console.log('MOCK FUNCTIONS')
    addMockFunctionsToSchema({ schema, mocks, preserveResolvers: true })
  }

  return schema
}
