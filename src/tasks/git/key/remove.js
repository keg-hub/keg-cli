const { confirmExec } = require('@keg-hub/ask-it')
const { gitKeyExists, removeGlobalConfigProp } = require('KegUtils')
const { constants: { GLOBAL_CONFIG_PATHS } } = require('@keg-hub/cli-utils')

/**
 * Removes the git key from the global config cli
 * @param {Object} globalConfig - Global config object for the keg-cli
 *
 * @returns {void}
 */
const removeGitKey = (args) => {
  const { globalConfig } = args

  confirmExec({
    confirm: `Remove git key from global config?`,
    success: `Removed git key from global config!`,
    cancel: `Remove git key from global config cancelled!`,
    preConfirm: !Boolean(gitKeyExists(globalConfig)),
    execute: () => removeGlobalConfigProp(
      globalConfig,
      `${GLOBAL_CONFIG_PATHS.GIT}.key`
    ),
  })
}


module.exports = {
  remove: {
    name: 'remove',
    alias: [ 'rm' ],
    action: removeGitKey,
    description: `Removes github key from the global config`,
    example: 'keg git key remove',
  }
}