const express = require('express')
const cors = require('cors')
const uuid = require('uuid')
const graphqlExpress = require('express-graphql')
const Conduit = require('@nerdsauce/conduit')

const auth = require('./auth')

const schemaPromise = require('./schema')()

const logger = (context) => next => (args, method) => {
  const random = uuid.v4()
  console.time(`gateway ${method}-${random}`)
  return next(args, method)
    .then(results => {
      console.timeEnd(`gateway ${method}-${random}`)
      return results
    })
}

const conduit = new Conduit(process.env.AMQP_URL, { name: 'graphql.service' })
  .middleware(logger)

const app = express()

app.use(cors())
app.use(async (req, res, next) => {
  if (req.method === 'POST') {
    console.time('auth')
    res.locals.viewer = await auth(req.get('authorization'))
    console.timeEnd('auth')
  }
  return next()
})
app.use(graphqlExpress(async (req, res) => {
  const schema = await schemaPromise
  return {
    schema,
    context: {
      viewer: res.locals.viewer,
      conduit: conduit.user(res.locals.viewer)
    },
    graphiql: true,
    formatError: (err) => {
      return {
        message: err.message,
        stack: err.stack
      }
    }
  }
}))
app.use((err, req, res, next) => {
  res.send({
    errors: [{
      message: err.message,
      stack: err.stack
    }]
  })
})

module.exports = app
