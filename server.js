const express = require('express')
const config = require('config')
const graphql = require('./graphql')

const app = express()

app.use('/api/graphql', graphql)

app.listen(config.get('port'), () => {
  console.log(`Listening on port "${ config.get('port') }`)
})
