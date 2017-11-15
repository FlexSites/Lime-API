const express = require('express')
const { expressPlayground } = require('graphql-playground-middleware')
const graphql = require('./graphql')

const app = express()
const PORT = process.env.PORT || 5000

app.get('/', (req, res) => {
  res.redirect(301, '/api/graphql')
})

app.get('/api/graphql', expressPlayground({ endpoint: '/api/graphql' }))
app.use('/api/graphql', graphql)

app.listen(PORT, () => {
  console.info(`gateway.graphql on port "${PORT}"`)
})
