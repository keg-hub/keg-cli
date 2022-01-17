const { noOpObj } = require('@keg-hub/jsutils')
const { getContextEnvs } = require('../context/getContextEnvs')
const { getKegGlobalConfig, cliStore, constants } = require('@keg-hub/cli-utils')

const { DOC_ENV_CONTEXT_SRV } = constants.SERVICES

/**
 * Calls the docker constants inject methods
 * Adds the app and container paths to the docker constants at runtime
 * @function
 * @param {Object} args - Task arguments object
 * @param {Object} args.params - Task options parsed into an object
 * @param {Object} args.globalConfig - Global config object for the keg-cli
 * @param {Object} containerPaths - Paths to the apps container files
 *
 * @returns {Void}
 */
const envContextService = async (args, extraEnvs=noOpObj) => {
  const { params, globalConfig=getKegGlobalConfig() } = args
  const context = params.tap || params.context

  // Ensure the context envs are built
  const contextEnvs = getContextEnvs(params, globalConfig)

  // Add the extraEnvs envs to the contextEnvs
  cliStore.context.set(
    `${context}-envs`,
    {...contextEnvs, ...extraEnvs},
    {merge: true}
  )

  return cliStore.context.get(`${context}-envs`)
}

cliStore.service.set(DOC_ENV_CONTEXT_SRV, envContextService)

module.exports = {
  envContextService
}