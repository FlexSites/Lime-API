const { promisify } = require('util')
const glob = promisify(require('glob'))
const { makeExecutableSchema, addMockFunctionsToSchema } = require('graphql-tools')
const resolvers = require('./resolvers')
const mocks = require('./mocks')
const fs = require('fs')
const path = require('path')

module.exports = async () => {
  const files = await glob('**/*.graphql')
  const idl = await Promise.all(
    files.map((file) => {
      return fs.readFileSync(path.join(process.cwd(), file), 'utf8')
    })
  )
  const schema = makeExecutableSchema({
    typeDefs: idl,
    resolvers
  })

  if (process.env.NODE_ENV === 'mock') {
    console.log('MOCK FUNCTIONS')
    addMockFunctionsToSchema({ schema, mocks, preserveResolvers: true })
  }

  return schema
}
