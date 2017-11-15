const Conduit = require('@nerdsauce/conduit')
const auth = require('@nerdsauce/conduit/middleware/authorization')
const validation = require('@nerdsauce/conduit/middleware/joi-validation')
const Monk = require('monk')
const Joi = require('joi')

const db = new Monk(process.env.MONGODB_URL)
const conduit = new Conduit(process.env.AMQP_URL, { name: 'service.event.addMedia' })

const collection = db.get('event_source')
const schema = Joi.object().keys({
  id: Joi.string().required(),
  url: Joi.string().uri().required(),
  type: Joi.any().allow(['image', 'video']).required()
})

conduit
  .middleware(validation(schema))
  .middleware(auth(['add:medium']))
  .reaction('event.addMedia.v1', async (msg, message) => {
    // TODO: ACL
    await collection.insert(message)
    return msg
  })
