const { get, exists } = require('@keg-hub/jsutils')
const { cliStore, constants } = require('@keg-hub/cli-utils')
const { getServiceContext } = require('./utils/getServiceContext')
const { checkEnvConstantValue } = require('./utils/checkEnvConstantValue')

const buildTaskData = (args, contextData, { imgNameContext,  isNewImage}) => {
  // Check if the recreate param was explicitly passed. If it was, then we use that
  // Otherwise use the isNewImage value
  const recreate = get(args, `params.recreate`)
  const taskData = {
    pull: false,
    imgNameContext,
    recreate: exists(recreate) ? recreate : isNewImage
  }

  // Check envs for running the docker exec command
  // If KEG_AUTO_DOCKER_EXEC is set to false then don't call docker exec
  // If it's true or not defined, then call docker exec
  checkEnvConstantValue(contextData, 'KEG_AUTO_DOCKER_EXEC', false)
    && (taskData.skipDockerExec = true)

  // Check envs for creating the mutagen auto-sync
  // If KEG_AUTO_SYNC is set to false then don't create a mutagen sync
  // If it's true or not defined, then create a mutagen sync
  checkEnvConstantValue(contextData, 'KEG_AUTO_SYNC', false)
    && (taskData.skipDockerSyncs = true)

  return taskData
}

/**
 * Runs the build service, then the compose service
 * @function
 * @param {Object} args - Default task arguments passed from the runTask method
 * @param {Object} exArgs - Extra arguments to run the service
 * @param {string} exArgs.context - The context to run the `docker-compose` command in
 * @param {string} exArgs.container - Name of the container to run
 * @param {string} exArgs.image - Name of the image used to run the container
 * @param {string} exArgs.tap - Name of the tap to run the `docker-compose` command in
 *
 * @returns {*} - Response from the compose service
 */
const startService = async (args, contextData) => {
  contextData = contextData || getServiceContext(args)

  // Call the proxy service to make sure that is running
  const proxyService = cliStore.service.get(constants.SERVICES.TAP_PROXY_SRV)
  await proxyService(args, contextData)

  // Call the build service to ensure required images are built 
  const pullService = cliStore.service.get(constants.SERVICES.TAP_PULL_SRV)
  const pullResponse = await pullService(args, contextData, 'docker')

  const taskData = buildTaskData(
    args,
    contextData,
    pullResponse
  )


  console.log(`------- taskData -------`)
  console.log(taskData)
  process.exit()
  // Call the compose service to start the application
  // Pass in recreate, base on if a new image was pulled
  // Set 'pull' param to false, because we already did that above
  const composeService = cliStore.service.get(constants.SERVICES.TAP_COMPOSE_SRV)
  return await composeService(
    args,
    contextData,
    taskData
  )

}

cliStore.service.set(constants.SERVICES.TAP_START_SRV, startService)

module.exports = {
  startService
}
