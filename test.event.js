const AMQP = require('@nerdsauce/amqp')
const Monk = require('monk')
const config = require('config')
const uuid = require('uuid')

// const client = new AMQP('amqp://skrgohee:bjF9I5oug5lSJXYq9UORla2Y-qNo5rhw@donkey.rmq.cloudamqp.com/skrgohee')
const client = new AMQP('amqp://localhost')
const database = new Monk('localhost/ticketing')

async function delay(time = 1000) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, time)
  })
}


const db = database.get('event_source')

const id = 'b4e3e40a-7f58-428e-9b7d-5bbcfe74a5a8' // uuid.v4()
const authorization = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6Ik5rSkdNamxFUmpVek5FSXdRa1UwTURaR04wVkdRekEyUVVNMU5FRXhRamMwUmpJMk5ERXdRUSJ9.eyJpc3MiOiJodHRwczovL2ZsZXhodWIuYXV0aDAuY29tLyIsInN1YiI6ImdpdGh1YnwzNjc3NDQzIiwiYXVkIjpbImh0dHBzOi8vYXBpLmV2ZW51ZS5pbyIsImh0dHBzOi8vZmxleGh1Yi5hdXRoMC5jb20vdXNlcmluZm8iXSwiaWF0IjoxNTA3MjU2NTA1LCJleHAiOjE1MDczNDI5MDUsImF6cCI6ImZOaXlrVVdWWGh6UGdRZ1hyeWxQWExBVjdUZm5XWWNZIiwic2NvcGUiOiJvcGVuaWQgcXVlcnk6ZXZlbnRzIGNyZWF0ZTpldmVudHMgdXBkYXRlOmV2ZW50cyBkZWxldGU6ZXZlbnRzIn0.qcYk4785_LAkW0sGLzzPGXat95hCSft07gjk0-dvkOcnpsLR90ITbDatJSft-Uw-I63lPaop3zfAASVxHOTqe0bhvBIUC37kUGysyVp4JKPDmGLfMyDqI3b5wBxi6FxsKVfY26NWnMtgTXWccpGX3YR1gwS5k7FZCOuQ8PCQAhGasrIj5xQ5AbvjBPqYvI5URb9HuWn9d7YV8fepvsQqfRfvvisQeEnfh0NPwNMMYs0LIXbWM9ue7etbzNlEAsI4cpbi9fKlwK6NonAj4TMwnWWrJDumeKhh_8SAXT2olvj9AILsnIMRK05dEo4DqYG9trkdWNXfO-jkUnBvaAMmPQ'

const commit = (ex, type) => (user_id, process_id) => (aggregate_id, payload) => {
  const message = {
    type,
    user_id,
    process_id,
    aggregate_id,
    payload,
    timestamp: Date.now(),
  }
  return ex.publish(payload, { routingKey: payload.type, timestamp: payload.timestamp })
}

// const toEvent (msg) {
//   const payload = msg.json()
//   return {
//     type: msg.fields.routingKey,
//     user_id: msg.properties.headers.user_id,
//     process_id: msg.properties.correlationId,
//     aggregate_id: payload.id,
//     payload,
//     timestamp: msg.properties.timestamp,
//   }
// }

// const toMessage(event) {
//   return {
//     payload: event.payload,
//     options: {
//       routingKey: event.type,
//       user_id: event.user_id,
//       correlationId: event.process_id,
//       aggregate_id: event.aggregate_id,
//       timestamp: event.timestamp,
//     }
//   }
// }

async function test() {
  const request_id = uuid.v4()
  const ex = client
    .exchange('event', 'topic', { durable: true })

  const orders = client
    .exchange('order', 'topic', { durable: true })

  const send = commit(ex)



  // const create = send('create')('test.user', uuid.v4())
  // const enable = send('enable')('test.user', uuid.v4())
  // const disable = send('disable')('test.user', uuid.v4())
  // const updateMeta = send('updateMeta')('test.user', uuid.v4())
  // const addShowtime = send('addShowtime')('test.user', uuid.v4())
  // const removeShowtime = send('removeShowtime')('test.user', uuid.v4())

  // await ex
  //   .publish({
  //     id,
  //     payload: {
  //       id,
  //       meta: {
  //         title: 'Seth Tippetts',
  //         description: 'great description',
  //       },
  //     },
  //     timestamp: Date.now(),
  //     user_id: 'system',
  //   }, {
  //     routingKey: 'create',
  //     authorization,
  //   })

  // await delay(1000)

  await ex
    .publish({
      id,
    }, {
      routingKey: 'enable',
      authorization,
    })

  await delay(1000)
  await ex
    .publish({
      id,
    }, {
      routingKey: 'disable',
      authorization,
    })

  await delay(1000)
  await ex
    .publish({
      id,
      meta: {
        title: 'My amazing title',
        description: 'Holy moley!!',
      },
    }, {
      routingKey: 'updateMeta',
      authorization,
    })

  const showtime = new Date().toISOString()

  await delay(1000)
  await ex
    .publish({
      id,
      payload: {
        id,
        timestamp: showtime,
      },
      user_id: 'system',
      timestamp: Date.now(),
    }, {
      routingKey: 'addShowtime',
      authorization,
    })

  await delay(1000)
  await ex
    .publish({
      id,
      payload: {
        id,
        timestamp: new Date().toISOString(),
      },
      timestamp: Date.now(),
    }, {
      routingKey: 'addShowtime',
      authorization,
    })

  await delay(1000)
  await ex
    .publish({
      id,
      payload: {
        id,
        timestamp: new Date().toISOString(),
      },
      timestamp: Date.now(),
    }, {
      routingKey: 'addShowtime',
      authorization,
    })

  await delay(1000)
  await ex
    .publish({
      id,
      timestamp: showtime,
    }, {
      routingKey: 'removeShowtime',
      authorization,
    })

  await delay(1000)
  await ex
    .publish({
      id,
    }, {
      routingKey: 'enable',
      authorization,
    })

  await delay(1000)
  await orders
    .publish({
      email: 'sethtippetts@gmail.com',
      items: {
        sku_BYD072cvCZL6aP: 2,
      }
    }, {
      routingKey: 'create',
      authorization,
    })

  // await delay(1000)
  // await ex
  //   .publish({
  //     id,
  //   }, {
  //     routingKey: 'remove',
  //     authorization,
  //   })

  await client.close()
}

test()
