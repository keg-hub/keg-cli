const { get, noOpObj } = require('@keg-hub/jsutils')
const { getContextEnvs } = require('./getContextEnvs')
const { inspect:imgInspect } = require('../image/inspect')
const { getKegGlobalConfig } = require('@keg-hub/cli-utils')
const { getLocationContext } = require('./getLocationContext')
const { inspect:containerInspect } = require('../container/inspect')
const { getImgNameContext } = require('../context/getImgNameContext')

/**
 * Builds the context envs for the current context based on passed in params
 * @param {Object} params - Task options parsed into an object
 * @param {Object} globalConfig - Global config object for the keg-cli
 * @param {Object} imgNameContext - Images provider, namespace, name, and tag
 *
 * @returns {Object} - Build context envs object
 */
const resolveContainerName = ({ container, __injected=noOpObj }, envs) => {
  return container ||
    get(__injected, `container`) ||
    get(envs, `CONTAINER_NAME`) ||
    get(__injected, `serviceName`)
}

/**
 * Builds the context for a docker container or image
 * Includes image and container information
 * @param {Object} args - Task arguments object
 * @param {Object} args.params - Task options parsed into an object
 * @param {Object} args.globalConfig - Global config object for the keg-cli
 *
 * @returns {Object} - Build context object
 */
const buildContext = async args => {
  const { params=noOpObj } = args

  const context = {
    name: params.tap || params.context,
  }

  const globalConfig = args.globalConfig || getKegGlobalConfig()
  context.imgNameContext = await getImgNameContext(params)
  context.envs = await getContextEnvs(
    params,
    globalConfig,
  )

  context.img = await imgInspect({
    log: false,
    skipError: true,
    image: context.imgNameContext.full,
  })

  context.container = await containerInspect({
    log: false,
    skipError: true,
    container: resolveContainerName(params, context.envs)
  })

  context.location = await getLocationContext(params, globalConfig)

  return context
}

module.exports = {
  buildContext
}