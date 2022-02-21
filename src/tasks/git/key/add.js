const { exists } = require('@keg-hub/jsutils')
const { encrypt } = require('@keg-hub/crypto-lib')
const { throwRequired } = require('KegUtils/error')
const { ask, confirmExec } = require('@keg-hub/ask-it')
const { gitKeyExists, addGlobalConfigProp } = require('KegUtils')
const { constants: { GLOBAL_CONFIG_PATHS }, getKegSetting } = require('@keg-hub/cli-utils')

/**
 * Encrypts then adds a git key to the global config.
 * @param {Object} globalConfig - Global config object for the keg-cli
 * @param {string} value - Value of the git key
 *
 * @returns {void}
 */
const addGitKey = (args) => {
  const { globalConfig, params, task } = args
  const { value, confirm, profile } = params

  // Ensure we have a value for the git key, or throw error
  if(!value) throwRequired(task, key, task.options.value)

  confirmExec({
    confirm: `Overwrite current git key in global config?`,
    force: !confirm,
    success: `Set git key in global config!`,
    cancel: `Set git key in global config cancelled!`,
    preConfirm: !Boolean(gitKeyExists(globalConfig)),
    execute: async () => {
      const password = getKegSetting(`git.secure`)
        ? await ask.password('Please enter a password')
        : false

      const keyPath = exists(profile)
        ? `${GLOBAL_CONFIG_PATHS.GIT}.profiles.${profile}.key`
        : `${GLOBAL_CONFIG_PATHS.GIT}.key`

      addGlobalConfigProp(
        globalConfig,
        keyPath,
        // Encrypt the value before saving,
        // So at least not saving in plain text
        encrypt(value, password)
      )
    }
  })

}

module.exports = {
  add: {
    name: 'add',
    action: addGitKey,
    description: `Adds a github key to the global config`,
    example: 'keg key add <options>',
    options: {
      value: {
        alias: [ 'val' ],
        description: 'Git key to access repos from a git provider ( github )',
        example: 'key key add value=<Git Key Value>',
        required: true
      },
      profile: {
        alias: ['pat', 'pro'],
        example: "keg key add --profile <alias>",
      },
      confirm: {
        alias: [ 'c' ],
        description: 'If true, add will ask you if you want to overwrite an existing key',
        example: 'key key add value=123 --no-confirm',
        default: true
      },
    }
  }
}
