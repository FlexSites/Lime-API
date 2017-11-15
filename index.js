require('dotenv').load()

// Workers
require('@nerdsauce/worker.event.mongo')
require('@nerdsauce/worker.event.stripe')
require('@nerdsauce/worker.order.mongo')
require('@nerdsauce/worker.order.stripe')
require('@nerdsauce/worker.venue.mongo')

// Services
require('@nerdsauce/service.event.addmedia')
require('@nerdsauce/service.event.addshowtime')
require('@nerdsauce/service.event.create')
require('@nerdsauce/service.event.disable')
require('@nerdsauce/service.event.enable')
require('@nerdsauce/service.event.query')
require('@nerdsauce/service.event.remove')
require('@nerdsauce/service.event.remove-showtime')
require('@nerdsauce/service.event.updatemeta')
require('@nerdsauce/service.order.create')
require('@nerdsauce/service.venue.create')
require('@nerdsauce/service.venue.disable')
require('@nerdsauce/service.venue.enable')
require('@nerdsauce/service.venue.query')
require('@nerdsauce/service.venue.remove')
require('@nerdsauce/service.venue.updateaddress')
require('@nerdsauce/service.venue.updatemeta')

// Gateway
require('@nerdsauce/gateway.graphql')
