const { fromGlobalId } = require('graphql-relay')
const { promisify } = require('util')
const {
  GraphQLEmail,
  GraphQLURL,
  GraphQLDateTime,
  GraphQLLimitedString,
  GraphQLPassword,
  GraphQLUUID,
} = require('graphql-custom-types')
const uuid = require('uuid')
const { commit } = require('../../commit')
const stripe = require("stripe")(
  "sk_test_dn38vHRQy67f3prQF1Anhm4T"
);

const listProducts = promisify(stripe.products.list.bind(stripe.products))

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
    },
  },
  Query: {
    events: async (source, args, context, info) => {
      console.time('stripe')
      const { data } = await listProducts()
      console.timeEnd('stripe')
      console.log('products', data, data.map(product => ({ node: product })))

      return { pageInfo: {}, edges: data.map(product => ({ node: product })) }
    }
  },
  Mutation: {
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
