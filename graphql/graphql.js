const express = require('express')
const cors = require('cors')
const graphqlExpress = require('express-graphql')
const getSchema = require('./schema')

const app = express()

app.use(cors())
// app.use(auth())
let schema = null
app.use(graphqlExpress(async (req, res) => {
  if (!schema) {
    schema = await getSchema()
  }
  return {
    schema,
    context: {
      viewer: res.locals.viewer,
    },
    graphiql: true,
    formatError: (err) => {
      return {
        message: err.message,
        stack: err.stack,
      }
    }
  }
}))

module.exports = app
