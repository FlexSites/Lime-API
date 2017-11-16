const axios = require('axios')
const { Network } = require('relay-runtime')

// Define a function that fetches the results of an operation (query/mutation/etc)
// and returns its results as a Promise:
function fetchQuery(
  operation,
  variables,
  cacheConfig,
  uploadables,
) {
  return axios
    .post('http://localhost:5000/api/graphql', {
        query: operation.text, // GraphQL text from input
        variables,
      },
      {
        headers: {
          'content-type': 'application/json'
        }
    })
    .then(({ data }) => data);
}

// Create a network layer from the fetch function
const network = Network.create(fetchQuery);

module.exports = network
