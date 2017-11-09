const path = require('path')
const { promisify } = require('util')
const glob = promisify(require('glob'))
const readFile = promisify(require('fs').readFile)

const EXCLUDED = [
  'services/gateway.graphql'
]

module.exports = async () => {
  const schemaFiles = await glob('**/*.graphql')

  return Promise.all(
    schemaFiles
      .filter(file => !EXCLUDED.includes(file))
      .map((file) => readFile(path.join(process.cwd(), file), 'utf8'))
  )
}
