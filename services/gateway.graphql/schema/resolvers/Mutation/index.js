const { createEvent } = require('./createEvent')
const { createVenue } = require('./createVenue')

module.exports = {
  Mutation: {
    createEvent,
    createVenue
  }
}
