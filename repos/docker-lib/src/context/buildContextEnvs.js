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
 * @param {Object} imgNameContext - Images provider, namespace, name, and tag
 *
 * @returns {Object} - Build context envs object
 */
const buildContextEnvs = async (
  params,
  globalConfig=getKegGlobalConfig(),
  imgNameContext
) => {
  imgNameContext = imgNameContext || await getImgNameContext(params, undefined, globalConfig)

  // Don't use cache context-envs from the store
  // We don't know if the cache version contains the correct KEG_IMAGE_FROM and KEG_IMAGE_TAG
  // getContextEnvs uses the store, so it will pull the store version if it exists
  // But we want to ensure we pull the correct imgNameContext, so it always gets rebuilt
  const context = params.tap || params.context
  const imgEnvs = await paramsToImgEnv(
    params,
    globalConfig,
    imgNameContext
  )

  const builtEnvs = {
    ...getContextEnvs(params, globalConfig),
    ...imgEnvs,
  }

  cliStore.context.set(`${context}-envs`, builtEnvs, {override: true})

  return builtEnvs
}

module.exports = {
  buildContextEnvs
}