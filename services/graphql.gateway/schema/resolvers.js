const { fromGlobalId } = require('graphql-relay')
const {
  GraphQLEmail,
  GraphQLURL,
  GraphQLDateTime
} = require('graphql-custom-types')
const uuid = require('uuid')
const Monk = require('monk')

const db = new Monk(process.env.MONGODB_URL)

const venueRead = db.get('venue.v1', { castIds: false })

const delay = (timeout) => {
  return new Promise((resolve) => setTimeout(resolve, timeout))
}

// const commitEvent = commit('event')

const resolvers = {
  Node: {
    __resolveType (source) {
      try {
        const { type } = fromGlobalId(source.id || source._id)
        return type
      } catch (ex) {
        return 'Event'
      }
    }
  },
  Query: {
    events: async (source, args, { conduit }, info) => {
      console.log('start event query')
      console.time('event.query.v1')
      return conduit
        .action('event.query.v1', {})
        .then((data) => {
          console.timeEnd('event.query.v1')
          return { pageInfo: {}, edges: data.map(product => ({ node: product })) }
        })
    },
    venues: async (source, args, { conduit }, info) => {
      return conduit.action('venue.query.v1', {})
        .then((venues) => {
          return { pageInfo: {}, edges: venues.map(venue => ({ node: venue })) }
        })
    }
  },
  Event: {
    id ({ id, _id }) {
      return _id || id
    },
    meta: (source) => {
      return {
        title: source.name,
        description: source.description
      }
    },
    showtimes: async (source, args, context, info) => {
      console.log('LISTING SKUS', source.id)
      const { data } = source.skus

      return data.map((showtime) => {
        console.log('SHOWTIME', showtime)
        return {
          id: showtime.id,
          timestamp: showtime.attributes.timestamp,
          remaining: showtime.inventory.quantity
        }
      })
    }
  },
  Order: {
    id ({ id, _id }) {
      return _id || id
    }
  },
  Venue: {
    id ({ id, _id }) {
      return _id || id
    }
  },
  Mutation: {
    async createVenue (_, { input }, { conduit }) {
      const clientMutationId = input.clientMutationId
      delete input.clientMutationId

      input.id = uuid.v4()

      return conduit.action('venue.create.v1', input)
        .then((venue) => {
          return {
            clientMutationId,
            venue
          }
        })
    },
    async disableVenue (_, { input }, { viewer, conduit }) {
      const id = uuid.v4()
      await conduit.emit('venue.disable', {
        id,
        viewer_id: viewer.id,
        process_id: input.clientMutationId,
        type: 'create',
        payload: input,
        timestamp: Date.now()
      })
      await delay(1000)
      return {
        clientMutationId: input.clientMutationId,
        venue: venueRead.findOne({ _id: id })
      }
    },
    async enableVenue (_, { input }, { viewer, conduit }) {
      const id = uuid.v4()
      await conduit.emit('venue.enable', {
        id,
        viewer_id: viewer.id,
        process_id: input.clientMutationId,
        type: 'create',
        payload: input,
        timestamp: Date.now()
      })
      await delay(1000)
      return {
        clientMutationId: input.clientMutationId,
        venue: venueRead.findOne({ _id: id })
      }
    },
    async removeVenue (_, { input }, { viewer, conduit }) {
      const id = uuid.v4()
      await conduit.emit('venue.remove', {
        id,
        viewer_id: viewer.id,
        process_id: input.clientMutationId,
        type: 'create',
        payload: input,
        timestamp: Date.now()
      })
      await delay(1000)
      return {
        clientMutationId: input.clientMutationId,
        venue: venueRead.findOne({ _id: id })
      }
    },
    async updateVenueAddress (_, { input }, { viewer, conduit }) {
      const id = uuid.v4()
      await conduit.emit('venue.updateAddress', {
        id,
        viewer_id: viewer.id,
        process_id: input.clientMutationId,
        type: 'create',
        payload: input,
        timestamp: Date.now()
      })
      await delay(1000)
      return {
        clientMutationId: input.clientMutationId,
        venue: venueRead.findOne({ _id: id })
      }
    },
    async updateVenueMeta (_, { input }, { viewer, conduit }) {
      const id = uuid.v4()
      await conduit.emit('venue.updateMeta', {
        id,
        viewer_id: viewer.id,
        process_id: input.clientMutationId,
        type: 'create',
        payload: input,
        timestamp: Date.now()
      })
      await delay(1000)
      return {
        clientMutationId: input.clientMutationId,
        venue: venueRead.findOne({ _id: id })
      }
    },
    async updateVenueCapacity (_, { input }, { viewer, conduit }) {
      const id = uuid.v4()
      await conduit.emit('venue.enable', {
        id,
        viewer_id: viewer.id,
        process_id: input.clientMutationId,
        type: 'create',
        payload: input,
        timestamp: Date.now()
      })
      await delay(1000)
      return {
        clientMutationId: input.clientMutationId,
        venue: venueRead.findOne({ _id: id })
      }
    },
    async createOrder (_, { input }, { conduit }) {
      const id = uuid.v4()
      input.id = id
      console.log('CREATE ORDER', input)
      await conduit.emit('order.create', {
        id,
        type: 'create',
        payload: input,
        process_id: input.clientMutationId,
        timestamp: Date.now()
      })
      await delay(5000)
      const order = await db.get('order.v1', { castIds: false }).findOne({ _id: id })
      console.log('ORDER RESULTS', order)
      return {
        order,
        user: { id: 'seth', name: 'Seth Tippetts' }
      }
    }
    // createEvent(_, { input }, { commit }) {
    //   input.id = uuid.v4()
    //   return commit('event')('create')(input, {
    //     correlationId: input.clientMutationId,
    //   })
    //     .then(() => {
    //       return {
    //         clientMutationId: input.clientMutationId,
    //         event: input,
    //       }
    //     })
    // },
    // removeEvent(_, { input }, { commit }) {
    //   return commit('event')('create')(input)
    //     .then(() => {
    //       return {
    //         clientMutationId: input.clientMutationId,
    //         event: input,
    //       }
    //     })
    // },
    // updateEventMeta(_, { input }, { commit }) {
    //   commit('UPDATE_EVENT_META', input)
    // },
    // addEventShowtime(_, { input }, { commit }) {
    //   commit('ADD_EVENT_SHOWTIME', input)
    // },
    // removeEventShowtime(_, { input }, { commit }) {
    //   commit('REMOVE_EVENT_SHOWTIME', input)
    // },
    // addEventMedia(_, { input }, { commit }) {
    //   commit('ADD_EVENT_MEDIA', input)
    // },
    // enableEvent(_, { input }, { commit }) {
    //   commit('ENABLE_EVENT', input)
    // },
    // disableEvent(_, { input }, { commit }) {
    //   commit('DISABLE_EVENT', input)
    // },
  },
  // Email: GraphQLEmail,
  DateTime: GraphQLDateTime,
  // LimitedString: GraphQLLimitedString,
  // Password: GraphQLPassword,
  // UUID: GraphQLUUID,
  Url: GraphQLURL,
  Email: GraphQLEmail
  // Query: {
  //   node: (source, args, { viewer }, info) => {
  //     const { type, id } = fromGlobalId(args.id)
  //     return TYPES[type].get(id)
  //   },
  //   venues: (source, args, { viewer }, info) => {
  //     return Venue.query(viewer, args)
  //   },
  // },

  // Venue: {
  //   events: ({ id }, args, { viewer }, info) => {
  //     return Event.query(viewer, { venue_id: id })
  //       .then((events) => {
  //         console.log(events)

  //         return events
  //       })
  //   },
  // },

  // Meta: {
  //   title: ({ title, name }) => {
  //     return title || name
  //   },
  // },

  // Event: {
  //   id: ({ id, _id }) => {
  //     return id || _id
  //   },
  //   showtimes: ({ id }, args, { viewer }, info) => {
  //     return Showtime.query(viewer, { event_id: id })
  //   },
  //   range: async ({ id }, args, { viewer }, info) => {
  //     const showtimes = await Showtime.query(viewer, { event_id: id })

  //     const [ start, end ] = showtimes
  //       .sort((a, b) => {
  //         return b.meta.timestamp - a.meta.timestamp
  //       })
  //       .splice(1, showtimes.length - 2)

  //     return start.format
  //   },
  // },
}

module.exports = resolvers

// const keyStructure = `:tenant/:type/:aggregate/:timestamp.json`

// {
//   "Version": "2008-10-17",
//   "Id": "example-ID",
//   "Statement": [
//    {
//     "Sid": "example-statement-ID",
//     "Effect": "Allow",
//     "Principal": {
//       "AWS": "*"
//     },
//     "Action": [
//      "SQS:SendMessage"
//     ],
//     "Resource": "SQS-ARN",
//     "Condition": {
//        "ArnLike": {
//        "aws:SourceArn": "arn:aws:s3:*:*:bucket-name"
//      }
//     }
//    }
//   ]
//  }

//  {
//   "Version": "2012-10-17",
//   "Id": "arn:aws:sqs:us-west-2:611601652995:event-source-queue/SQSDefaultPolicy",
//   "Statement": [
//     {
//      "Sid": "sqs-s3-source",
//      "Effect": "Allow",
//      "Principal": {
//        "AWS": "*"
//      },
//      "Action": [
//       "SQS:SendMessage"
//      ],
//      "Resource": "arn:aws:sqs:us-west-2:611601652995:event-source-queue",
//      "Condition": {
//         "ArnLike": {
//         "aws:SourceArn": "arn:aws:s3:*:*:lime-events"
//       }
//      }
//     }
//    ]
// }
