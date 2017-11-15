require('dotenv').load()

// Workers
require('@nerdsauce/worker.event.mongo')
require('@nerdsauce/worker.venue.mongo')
require('@nerdsauce/worker.event.stripe')
require('@nerdsauce/worker.order.mongo')
require('@nerdsauce/worker.order.stripe')

// Services
require('@nerdsauce/event.create')
require('@nerdsauce/event.query')
require('@nerdsauce/venue.query')
require('@nerdsauce/venue.create')
require('@nerdsauce/service.event.addmedia')
require('@nerdsauce/service.event.updatemeta')
require('@nerdsauce/service.event.enable')
require('@nerdsauce/service.event.disable')
require('@nerdsauce/service.venue.enable')
require('@nerdsauce/service.event.remove')
require('@nerdsauce/service.venue.remove')
require('@nerdsauce/service.venue.updateaddress')
require('@nerdsauce/service.venue.updatemeta')
require('@nerdsauce/service.venue.disable')
require('@nerdsauce/service.event.addshowtime')
require('@nerdsauce/service.event.remove-showtime')
require('@nerdsauce/service.order.create')

// Gateway
require('@nerdsauce/graphql.gateway')
