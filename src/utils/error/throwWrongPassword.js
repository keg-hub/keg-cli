const { Logger } = require('@keg-hub/cli-utils')
const { throwTaskFailed } = require('./throwTaskFailed')

const throwWrongPassword = (extraMessage) => {

  extraMessage && Logger.info(extraMessage)
  Logger.error(`\n You entered an invalid password!`)
  Logger.empty()

  throwTaskFailed()

}

module.exports = {
  throwWrongPassword
}