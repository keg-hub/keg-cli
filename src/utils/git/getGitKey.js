const { ask } = require('@keg-hub/ask-it')
const { decrypt } = require('@keg-hub/crypto-lib')
const { get, noOpObj, exists } = require('@keg-hub/jsutils')
const { constants: { GLOBAL_CONFIG_PATHS }, getKegSetting, error } = require('@keg-hub/cli-utils')

/**
 * Try catch wrapper around decrypting a key
 * @param {string} key - Key to decrypt
 * @param {string} password - String to decrypt the key
 *
 * @returns {string} 
 */
const decryptKey = (key, password) => {
  try {
    return decrypt(key, password)
  }
  catch(e){
    error.throwError(`Entered an invalid password!`)
  }
}

/**
 * Gets the git key to allow cloning private repos
 * Pulls from the ENV GIT_KEY or global config
 * @param {Object} globalConfig - Global config object for the Keg CLI
 *
 * @returns {string} - Found git key
 */
const getGitKey = async (globalConfig, { profile, pass }=noOpObj) => {
  if(process.env.GIT_KEY) return process.env.GIT_KEY

  const password = getKegSetting(`git.secure`)
    ? pass || await ask.password('Please enter your password')
    : false

  const gitConf = get(globalConfig, `${GLOBAL_CONFIG_PATHS.GIT}`)
  if(!exists(profile)) return decryptKey(gitConf.key, password)

  !gitConf.profiles &&
    error.throwError(`Git profiles not configured in keg-cli global config`)

  const found = gitConf.profiles[profile]
  !found && error.throwError(`Git profile ${profile} not found in keg-cli global config`)

  return decryptKey(found.key || found.pat, password)
}

module.exports = {
  getGitKey
}
