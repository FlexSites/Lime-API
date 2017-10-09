
const monk = require('monk')

// const db = monk('mongo://localhost')

// db.addMiddleware(logger)

// const logger = context => next => (args, method) => {
//   console.log(method, args)
//   return next(args, method)
//     .then((res) => {
//       console.log(method + ' result', res)
//       return res
//     })
// }

exports.write = (tenant, type, payload) => {
  return db.get(type).find({ })
  // return s3
  //   .putObject({
  //     Key: `events/${ tenant }/${ type }/${ payload.id }/${ Date.now() }.json`,
  //     Body: JSON.stringify(payload),
  //     Bucket: 'lime-events',
  //   })
  //   .promise()
}

exports.read = (handler) => {
  // const consumer = Consumer.create({
  //   queueUrl: 'https://sqs.us-west-2.amazonaws.com/611601652995/event-source-queue',
  //   handleMessage: (message, done) => {
  //     const { Records } = JSON.parse(message.Body)
  //     return Promise
  //       .all(
  //         Records
  //           .map((record) => record.s3.object.key)
  //           .map((key) => {
  //             return s3
  //             .getObject({
  //               Key: key,
  //               Bucket: 'lime-events',
  //             })
  //             .promise()
  //             .then(object => {
  //               return handler(JSON.parse(object.Body.toString('utf8')))
  //             })
  //           })
  //       )
  //       .then(() => done())
  //       .catch(ex => {
  //         console.log('horrible error', ex)
  //         done(ex)
  //       })
  //   }
  // })
  // consumer.start()
  // return consumer
}
