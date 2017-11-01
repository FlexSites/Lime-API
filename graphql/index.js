const express = require('express')
const graphql = require('./graphql')

const app = express()
const PORT = process.env.PORT || 3000

app.get('/', (req, res) => {
  res.redirect('/api/graphql', 302)
})
app.use('/api/graphql', graphql)

app.listen(PORT, () => {
  console.log(`Listening on port "${ PORT }"`)
})
