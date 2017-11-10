require('dotenv').load()

// Workers
require('@nerdsauce/event.mongo')
require('@nerdsauce/venue.mongo')
require('@nerdsauce/event.stripe')

// Services
require('@nerdsauce/event.create')
require('@nerdsauce/event.query')
require('@nerdsauce/venue.query')
require('@nerdsauce/venue.create')
require('@nerdsauce/service.venue.enable')
require('@nerdsauce/service.venue.remove')
require('@nerdsauce/service.venue.updateAddress')

// Gateway
require('@nerdsauce/graphql.gateway')
