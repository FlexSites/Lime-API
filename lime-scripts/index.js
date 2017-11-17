const Conduit = require('@nerdsauce/conduit')
const yargs = require('yargs')
const cwd = process.cwd()
const { main, lime } = require(cwd, './package.json')
const script = require(cwd, yargs.argv[0] || main)
const name = args.n || lime.name

const conduit = new Conduit(process.env.AMQP_URL, { name })

conduit.reaction(args.r || lime.route, script)
