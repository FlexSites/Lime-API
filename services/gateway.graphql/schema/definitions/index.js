const path = require('path')
const { promisify } = require('util')
const glob = promisify(require('glob'))
const readFile = promisify(require('fs').readFile)

module.exports = async () => {
  const schemaFiles = await glob('**/*.graphql', { nodir: true })
  return Promise.all(
    schemaFiles.map((file) => readFile(path.join(process.cwd(), file), 'utf8'))
  )
}
