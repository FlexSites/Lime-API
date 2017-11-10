const { createEvent } = require('./createEvent')
const { disableEvent } = require('./disableEvent')
const { createVenue } = require('./createVenue')
const { enableVenue } = require('./enableVenue')
const { removeVenue } = require('./removeVenue')
const { updateVenueAddress } = require('./updateVenueAddress')
const { updateVenueMeta } = require('./updateVenueMeta')

module.exports = {
  Mutation: {
    createEvent,
    createVenue,
    disableEvent,
    enableVenue,
    removeVenue,
    updateVenueAddress,
    updateVenueMeta
  }
}
