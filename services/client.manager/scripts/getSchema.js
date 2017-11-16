var axios = require('axios');
var fs = require('fs');

const {
  buildClientSchema,
  introspectionQuery,
  printSchema,
} = require('graphql/utilities');

console.log(introspectionQuery);

axios.post('http://localhost:5000/api/graphql', { query: introspectionQuery }, {
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
})
  .then(({ data }) => data)
  .then(res => {
    console.log(res);
    const schemaString = printSchema(buildClientSchema(res.data));
    fs.writeFileSync('schema.graphql', schemaString);
  });
