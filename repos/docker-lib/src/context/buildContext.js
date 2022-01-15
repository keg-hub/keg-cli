const { get, noOpObj } = require('@keg-hub/jsutils')
const { getContextEnvs } = require('./getContextEnvs')
const { inspect:imgInspect } = require('../image/inspect')
const { getKegGlobalConfig } = require('@keg-hub/cli-utils')
const { paramsToImgEnv } = require('../envs/paramsToImgEnv')
const { inspect:containerInspect } = require('../container/inspect')
const { getImgNameContext } = require('../context/getImgNameContext')

const resolveContainerName = ({ container, __injected=noOpObj }, envs) => {
  return container ||
    get(__injected, `container`) ||
    get(envs, `CONTAINER_NAME`) ||
    get(__injected, `serviceName`)
}

const buildContextEnvs = async (params, globalConfig, imgNameContext) => {
  const imgEnvs = await paramsToImgEnv(params, globalConfig, imgNameContext)
  return {
    ...getContextEnvs(params, globalConfig),
    ...imgEnvs,
  }
}

/**
 * Builds the context for a docker container or image
 * Includes image and container information
 * 
 */
const buildContext = async args => {
  const { params=noOpObj } = args

  const context = {}
  const globalConfig = args.globalConfig || getKegGlobalConfig()
  context.imgNameContext = await getImgNameContext(params)
  context.envs = await buildContextEnvs(
    params,
    globalConfig,
    context.imgNameContext
  )

  context.imgObj = await imgInspect({
    log: false,
    skipError: true,
    image: context.imgNameContext.full,
  })

  context.containerObj = await containerInspect({
    log: false,
    skipError: true,
    container: resolveContainerName(params, context.envs)
  })

  // TODO: add getLocationContext
  // Remove prefix BS

  return context
}

module.exports = {
  buildContext
}