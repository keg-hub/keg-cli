
const { isArr, toStr } = require('@keg-hub/jsutils')
const { ensureDocker } = require('./ensureDocker')

/**
 * Validates the docker command options
 * Adds force and format as needed based on passed in params
 * 
 * @param {Array|string} opts - optional arguments to pass to the docker command
 * @param {string} [format=''] - Format the output of the docker command
 * @param {boolean} force - Pass "--force" to the docker command, to force the operation
 * returns {string} - Docker command to run
 */
const validateOpts = (opts, format='', force) => {

  const options = isArr(opts) ? opts.join(' ').trim() : toStr(opts)
  const useFormat = format === 'json' ? `--format "{{json .}}"` : format
  const useForce = force ? '--force' : ''

  return ensureDocker(`${ options } ${ useForce } ${ useFormat }`.trim())
}

module.exports = {
  validateOpts
}