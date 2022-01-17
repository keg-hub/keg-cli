
const { Logger, error } = require('@keg-hub/cli-utils')

const throwMissingContext = tap => {
  Logger.error(`The tap ${ tap } context has not been loaded.\n`)
  Logger.highlight(`Ensure context is loaded before calling the service method!`)

  error.throwTaskFailed()
}

module.exports = {
  throwMissingContext
}