const { createEvent } = require('./createEvent')
const { createVenue } = require('./createVenue')
const { enableVenue } = require('./enableVenue')
const { removeVenue } = require('./removeVenue')

module.exports = {
  Mutation: {
    createEvent,
    createVenue,
    enableVenue,
    removeVenue
  }
}
