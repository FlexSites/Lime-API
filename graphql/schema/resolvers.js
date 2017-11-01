const { fromGlobalId } = require('graphql-relay')
const { promisify } = require('util')
const {
  GraphQLEmail,
  GraphQLURL,
  GraphQLDateTime,
  GraphQLLimitedString,
  GraphQLPassword,
  GraphQLUUID
} = require('graphql-custom-types')
const uuid = require('uuid')
const Monk = require('monk')
const stripe = require('stripe')(
  'sk_test_dn38vHRQy67f3prQF1Anhm4T'
)
const Conduit = require('@nerdsauce/conduit')
const conduit = new Conduit(process.env.AMQP_URL, { name: 'graphql.service'})

// conduit.middleware(context => next => (args, method) => {
//   console.log('DEBUG:', method, args)
//   return next(args, method)
// })

const db = new Monk(process.env.MONGODB_URL)

const venueRead = db.get('venue.v1', { castIds: false })

const delay = (timeout) => {
  return new Promise((resolve) => setTimeout(resolve, timeout))
}

const listProducts = promisify(stripe.products.list.bind(stripe.products))
const listSkus = promisify(stripe.skus.list.bind(stripe.skus))
const listOrders = promisify(stripe.orders.list.bind(stripe.orders))

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
    events: async (source, args, context, info) => {
      return conduit.action('event.query.v1', {})
        .then((data) => {
          return { pageInfo: {}, edges: data.map(product => ({ node: product })) }
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
    async createVenue (_, { input }) {
      const id = uuid.v4()
      await conduit.emit('venue.create', {
        id,
        process_id: input.clientMutationId,
        type: 'create',
        payload: input,
        timestamp: Date.now()
      })
      await delay(1000)
      const venue = await venueRead.findOne({ _id: id })
      console.log('venue', venue)
      return {
        clientMutationId: input.clientMutationId,
        venue
      }
    },
    async disableVenue (_, { input }, { viewer }) {
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
    async enableVenue (_, { input }, { viewer }) {
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
    async removeVenue (_, { input }, { viewer }) {
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
    async updateVenueAddress (_, { input }, { viewer }) {
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
    async updateVenueMeta (_, { input }, { viewer }) {
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
    async updateVenueCapacity (_, { input }, { viewer }) {
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
    async createOrder (_, { input }) {
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
