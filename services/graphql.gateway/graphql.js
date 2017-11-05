const express = require('express')
const cors = require('cors')
const uuid = require('uuid')
const graphqlExpress = require('express-graphql')
const Conduit = require('@nerdsauce/conduit')

const AuthenticationClient = require('auth0').AuthenticationClient
const ManagementClient = require('auth0').ManagementClient
const get = require('lodash.get')
// const axios = require('axios')

const manage = new ManagementClient({
  clientId: 'WQTjdPVvXuIa0gHmzcYu5Fe6lkiqD8FL',
  domain: 'ticketing.auth0.com',
  clientSecret: 'vslUvK5xgHnGUD6cqrFjRNdl5Cb2JWby68E43w4686m5R-bLf14z-PKLXDZDHnpm'
})

const auth = new AuthenticationClient({
  domain: 'ticketing.auth0.com',
  clientId: 'D3QDBTxJhSqEmiSKRUJOk6SXSYfUUdp5'
})
const token = '-IV1cYdvDVfTaqsgSMWKvr_vLA38qkNJ'

const schemaPromise = require('./schema')()

const logger = (context) => next => (args, method) => {
  const random = uuid.v4()
  console.time(`${method}-${random}`)
  return next(args, method)
    .then(results => {
      console.timeEnd(`${method}-${random}`)
      return results
    })
}

const conduit = new Conduit(process.env.AMQP_URL, { name: 'graphql.service' })
  .middleware(logger)

const app = express()

app.use(cors())
// app.use(auth())
app.use(async (req, res, next) => {
  console.log(req.method)
  if (req.method !== 'POST') {
    return next()
  }
  try {
    console.time('auth')
    const { sub } = await auth.getProfile(token)
    const viewers = await manage.getUser(sub)
    res.locals.viewer = get(viewers, ['0', 'app_metadata', 'authorization'], {})
    console.timeEnd('auth')
    next()
  } catch (ex) {
    next(ex)
  }
})
app.use(graphqlExpress(async (req, res) => {
  console.log('reached graph')
  const schema = await schemaPromise
  console.log('schema ready')
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

module.exports = app
