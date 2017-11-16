const {
  Environment,
  Network,
  RecordSource,
  Store,
} = require('relay-runtime');
const network = require('./network')

const source = new RecordSource();
const store = new Store(source);
const handlerProvider = null;

const environment = new Environment({
  handlerProvider, // Can omit.
  network,
  store,
});

module.exports = environment
