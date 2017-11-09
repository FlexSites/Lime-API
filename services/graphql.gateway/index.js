const express = require('express')
const { expressPlayground } = require('graphql-playground-middleware')
const graphql = require('./graphql')

const app = express()
const PORT = process.env.PORT || 5000

// axios.get('https://flexhub.auth0.com/api/v2/users/user_id?fields=user_metadata&include_fields=true', {
//   headers: { 'content-type': 'application/json',
//     authorization: `Bearer ${token}`
//   }
// })
//   .then(res => {
//     console.log('result', res)
//   })
//   .catch(ex => {
//     console.error(ex)
//   })
app.get('/', (req, res) => {
  res.redirect(301, '/api/graphql')
})

app.get('/api/graphql', expressPlayground({ endpoint: '/api/graphql' }))
app.use('/api/graphql', graphql)

app.listen(PORT, () => {
  console.log(`Listening on port "${PORT}"`)
})
