const { createEvent } = require('./createEvent')
const { createVenue } = require('./createVenue')
const { enableVenue } = require('./enableVenue')

module.exports = {
  Mutation: {
    createEvent,
    createVenue,
    enableVenue
  }
}
