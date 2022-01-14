
const { Logger, error } = require('@keg-hub/cli-utils')

const throwMissingFile = (app, injectPath, fileName) => {
  Logger.error(`The app ${ app } has a container folder, but it's missing a ${ fileName } file.\n`)
  Logger.highlight(`Ensure the file`, fileName, `Exists at ${ injectPath }!`)

  error.throwTaskFailed()
}

module.exports = {
  throwMissingFile
}