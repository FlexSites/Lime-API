const Conduit = require('@nerdsauce/conduit')
const { promisify } = require('util')
const Stripe = require('stripe')
const get = require('lodash.get')

const stripe = new Stripe(process.env.STRIPE_TOKEN)
const conduit = new Conduit(process.env.AMQP_URL, { name: 'worker.event.stripe' })

const createProduct = promisify(stripe.products.create.bind(stripe.products))
const updateProduct = promisify(stripe.products.update.bind(stripe.products))
const removeProduct = promisify(stripe.products.del.bind(stripe.products))
const createSku = promisify(stripe.skus.create.bind(stripe.skus))
const delSku = promisify(stripe.skus.del.bind(stripe.skus))

conduit
  .on('event.create.v1', async (msg) => {
    // Create the product
    return createProduct({
      id: msg.id,
      name: get(msg, 'meta.title', 'Untitled Event'),
      description: get(msg, 'meta.description', 'Event Description'),
      // These are the characteristics of the product that SKUs provide values for
      attributes: ['timestamp'],
      active: false,
      shippable: false
    })
  })
  .on('event.enable.v1', async (msg) => {
    return updateProduct(msg.id, {
      active: true
    })
  })
  .on('event.disable.v1', async (msg) => {
    return updateProduct(msg.id, {
      active: false
    })
  })
  .on('event.updateMeta.v1', async ({ id, meta }) => {
    return updateProduct(id, {
      name: meta.title,
      description: meta.description
    })
  })
  .on('event.removeShowtime.v1', async (msg) => {
    return delSku(msg.showtime)
  })
  .on('event.addMedia.v1', async (msg) => {
    return updateProduct(msg.id, {
      images: [ msg.url ]
    })
  })
  .on('event.addMedia.v1', async (msg) => {
    return updateProduct(msg.id, {
      images: [ msg.url ]
    })
  })
  .on('event.addShowtime.v1', async (msg) => {
    return createSku({
      id: msg.id,
      product: msg.event,
      attributes: {
        timestamp: msg.timestamp
      },
      price: 1500,
      currency: 'usd',
      inventory: {
        type: 'finite',
        quantity: 500
      }
    })
  })
  .on('event.remove.v1', async (msg) => {
    return removeProduct(msg.id)
  })
