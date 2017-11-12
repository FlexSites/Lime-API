const { addEventMedia } = require('./addEventMedia')
const { addEventShowtime } = require('./addEventShowtime')
const { createEvent } = require('./createEvent')
const { disableEvent } = require('./disableEvent')
const { createVenue } = require('./createVenue')
const { enableVenue } = require('./enableVenue')
const { disableVenue } = require('./disableVenue')
const { removeVenue } = require('./removeVenue')
const { updateVenueAddress } = require('./updateVenueAddress')
const { updateVenueMeta } = require('./updateVenueMeta')

module.exports = {
  Mutation: {
    addEventMedia,
    addEventShowtime,
    createEvent,
    createVenue,
    disableEvent,
    enableVenue,
    disableVenue,
    removeVenue,
    updateVenueAddress,
    updateVenueMeta
  }
}
