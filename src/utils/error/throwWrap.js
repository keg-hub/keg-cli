const { Logger } = require('@keg-hub/cli-utils')


const throwWrap = (...message) => {
  (() => {

    Logger.empty()
    Logger.error(`\n ${message.join('\n ')}\n`)
    Logger.empty()

    throw new Error(`Task failed!`)
  })()
}

module.exports = {
  throwWrap
}