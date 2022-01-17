
const { error, Logger } = require('@keg-hub/cli-utils')

const throwMissingFile = (tap, location, fileName) => {
  Logger.error(`The tap ${ tap } has a container folder, but it's missing a ${ fileName } file.\n`)
  Logger.highlight(`Ensure the file`, fileName, `Exists at ${ location }!`)

  error.throwTaskFailed()
}

module.exports = {
  throwMissingFile
}