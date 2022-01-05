#!/usr/bin/env node
!process.env.KEG_CLI_PATH && (process.env.KEG_CLI_PATH = __dirname)

// Update the Max listeners, to ensure all processes can exit properly
require('events').EventEmitter.defaultMaxListeners = 0
require('./scripts/cli/aliases')
require('./src/constants')

/**
 * Checks if the Keg-CLI has been updated
 *
 * @returns {Promise} - Response from the checkUpdates method
 */
// const doCheckUpdates = () => {
//   // Load the checkUpdates module inline to speed up load times
//   const { checkUpdates } = require('KegScripts/cli/checkUpdates')
//   return checkUpdates()
// }

;(async () => {
  try {

    // Load the users global config, or create it on the fly
    const { loadGlobalConfig } = require('KegUtils/globalConfig/loadGlobalConfig')
    const globalConfig = await loadGlobalConfig()

    // // Pull in the runTask method, and call it immediately
    const { runTask } = require('./src/runTask')
    await runTask(globalConfig)

    // Check for Keg CLI updates if setting is true, then check for updates
    // get(globalConfig, `cli.settings.checkUpdates`) &&
    //   await doCheckUpdates()

  }
  catch(e){
    console.error(e.stack)
  }

})()
