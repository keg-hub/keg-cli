const { get } = require('@keg-hub/jsutils')
const { DOCKER } = require('KegConst/docker')
const { getKegProxyDomain } = require('KegUtils/proxy/getKegProxyDomain')

/**
 * Builds context data needed to create the injected docker-compose file
 * @function
 * @param {Object} data - Data to fill the compose template with
 * @param {Object} imgNameContext - Data to fill the compose template with
 
 *
 * @returns {Object} - Build compose context data
 */
const getComposeContextData = async (data, imgNameContext) => {

  const composeContext = {}

  // Get the pull image url for the service form the imageNameContext
  // If KEG_IMAGE_FROM ENV is defined, then use the env
  // Otherwise used the imageNameContext.full image url
  // This allows the ENV to be dynamic if it's defined,
  // Or use the image url when it's not
  composeContext.imageFrom = get(data, 'contextEnvs.KEG_IMAGE_FROM')
    ? '${KEG_IMAGE_FROM}'
    : imgNameContext.full

  // TODO: Investigate loading the default compose config,
  // Use this helper => getServiceName
  // This will always ensure it matches

  // The the docker image name for the service being started
  composeContext.service = get(
    data, `contextEnvs.KEG_COMPOSE_SERVICE`,
    get(data, `params.__injected.image`,
      get(data, `contextEnvs.IMAGE`,
        get(data, `contextEnvs.CONTAINER_NAME`, imgNameContext.image)
      )
    )
  )

  // Get the root path where the docker container should be built from
  composeContext.buildContextPath = get(
    data, `params.__injected.injectPath`,
    get(data, `contextEnvs.KEG_CONTEXT_PATH`, '${KEG_CONTEXT_PATH}')
  )

  // Get the path to the Dockerfile
  composeContext.dockerPath = get(
    data, `params.__injected.dockerPath`,
    get(data, `contextEnvs.KEG_DOCKER_FILE`, '${KEG_DOCKER_FILE}')
  )

  // Get the shared docker network
  composeContext.dockerNetwork = get(
    data, `contextEnvs.KEG_DOCKER_NETWORK`,
    get(DOCKER, `KEG_DOCKER_NETWORK`, '${KEG_DOCKER_NETWORK}')
  )

  // The the docker container name for the service being started
  composeContext.container = get(
    data, `params.__injected.container`,
    get(data, `params.container`,
      get(data, `contextEnvs.CONTAINER_NAME`, composeContext.service)
    )
  )

  composeContext.proxyDomain = await getKegProxyDomain(data, data.contextEnvs)

  return composeContext
}

module.exports = {
  getComposeContextData
}