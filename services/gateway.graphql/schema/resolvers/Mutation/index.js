const { createEvent } = require('./createEvent')
const { createVenue } = require('./createVenue')
const { enableVenue } = require('./enableVenue')
const { removeVenue } = require('./removeVenue')
const { updateVenueAddress } = require('./updateVenueAddress')

module.exports = {
  Mutation: {
    createEvent,
    createVenue,
    enableVenue,
    removeVenue,
    updateVenueAddress
  }
}
