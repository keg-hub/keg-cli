const { getContextEnvs } = require('./getContextEnvs')
const { paramsToImgEnv } = require('../envs/paramsToImgEnv')
const { getImgNameContext } = require('../context/getImgNameContext')
const {
  cliStore,
  getKegGlobalConfig
} = require('@keg-hub/cli-utils')

/**
 * Builds the context envs for the current context based on passed in params
 * This gets called from the docker inject service
 * So it should exist before any task actions are run
 * Which means they will have access to the pre-loaded cached envs for the context
 * @param {Object} params - Task options parsed into an object
 * @param {Object} globalConfig - Global config object for the keg-cli
 *
 * @returns {Object} - Build context envs object
 */
const buildContextEnvs = (params, globalConfig=getKegGlobalConfig()) => {
  const builtEnvs = getContextEnvs(params, globalConfig)
  cliStore.context.set(`${params.tap || params.context}-envs`, builtEnvs, {override: true})

  return builtEnvs
}

module.exports = {
  buildContextEnvs
}