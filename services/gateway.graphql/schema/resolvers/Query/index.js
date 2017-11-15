const {
  GraphQLEmail,
  GraphQLURL,
  GraphQLDateTime
} = require('graphql-custom-types')

const orders = require('./orders')
const events = require('./events')
const venues = require('./venues')
const Node = require('./NodeType')
const { node } = require('./node')
const Event = require('./Event')
const Venue = require('./Venue')

module.exports = {
  Query: {
    events,
    orders,
    venues,
    node
  },
  Node,
  Event,
  Venue,
  DateTime: GraphQLDateTime,
  Url: GraphQLURL,
  Email: GraphQLEmail
}
