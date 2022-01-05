const docker = require('@keg-hub/docker-lib')
const { getDefaultEnv } = require('@keg-hub/cli-utils')
const { loadConfigFiles } = require('KegConst/docker/loaders')
const { generalError } = require('KegUtils/error/generalError')
const { getKegContext } = require('KegUtils/getters/getKegContext')

/**
 * Gets the action object from the loaded values files of a container
 * @function
 * @param {Object} params
 * @param {Object} params.env - The current env of the task being run
 * @param {Object} params.__internal - Any extra / injected params for injected taps
 * @param {Object} params.containerRef - Reference to the container of the actions to load
 *
 * @returns {Object} - Found actions from the values files of the container 
 */
const getActionsFromValues = async params => {
  let containerName = params.cmdContext ||
    params.context ||
    params.containerRef ||
    params.container

  containerName = !docker.isDockerId(containerName)
    ? containerName
    : await (async () => {
        const container = await docker.container.get(containerName)
        return container && container.name
      })()

  return !containerName
    ? generalError(`Could not find container name from params`, params)
    : await loadConfigFiles({
        noEnv: true,
        ymlPath: 'actions',
        env: params.env || getDefaultEnv(),
        name: getKegContext(containerName),
        __internal: {
          ...params.__internal,
          ...params.__injected,
        },
      })
}

module.exports = {
  getActionsFromValues
}