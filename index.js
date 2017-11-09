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

// Gateway
require('@nerdsauce/graphql.gateway')
