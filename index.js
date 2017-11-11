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
require('@nerdsauce/service.event.disable')
require('@nerdsauce/service.venue.enable')
require('@nerdsauce/service.venue.remove')
require('@nerdsauce/service.venue.updateaddress')
require('@nerdsauce/service.venue.updatemeta')
require('@nerdsauce/service.venue.disable')

// Gateway
require('@nerdsauce/graphql.gateway')
