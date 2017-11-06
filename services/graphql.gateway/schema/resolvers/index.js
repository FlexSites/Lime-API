const Query = require('./Query')
const Mutation = require('./Mutation')

module.exports = async () => {
  return Object.assign({}, Query, Mutation)
}
