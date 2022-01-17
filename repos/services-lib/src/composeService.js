const { mutagenService } = require('@keg-hub/mutagen-lib')
const { cliStore, constants } = require('@keg-hub/cli-utils')
const { getServiceContext } = require('./utils/getServiceContext')
const { checkEnvConstantValue } = require('./utils/checkEnvConstantValue')
const { constants, Logger, runInternalTask } = require('@keg-hub/cli-utils')
const {
  get,
  set,
  isArr,
  exists,
  deepMerge,
} = require('@keg-hub/jsutils')

const { buildContainerSync } = require('./syncService')
const { buildExecParams } = require('../docker/buildExecParams')
const { getContainerCmd } = require('../docker/getContainerCmd')

const {KEG_DOCKER_EXEC, KEG_EXEC_OPTS} = constants

/**
 * Runs `docker-compose` up command based on the passed in args
 * @function
 * @param {Object} args - Default task arguments joined with the passed in exArgs
 * @param {Object} containerContext - Context of the current container to sync with
 *
 * @returns {Array} - An array of promises for each sync being setup
 */
const createSyncs = async (args, containerContext) => {
  const { sync, tap, context, __injected } = args.params
  const { cmdContext, container, id } = containerContext
  const containRef = container || id || cmdContext || context

  const syncs = isArr(sync) &&
    await Promise.all(
      await sync.reduce(async (toResolve, dependency) => {
        const resolved = await toResolve
        resolved.push(
          await buildContainerSync(
            { ...args, params: { dependency, tap, context, __injected } },
            { container: containRef, dependency }
          )
        )
        return resolved
      }, Promise.resolve([]))
    )

  return syncs
}

/**
 * Checks if the mutagen sync should be created for the service and creates it
 * @function
 * @param {Object} args - Default task arguments passed from the runTask method
 * @param {Object} args - Custom arguments merged with the args param
 * @param {Object} containerContext - container meta data for the started service
 * @param {Object} tap - Name of the tap is the service was a tap
 * @param {Object} context - Context of the service that was started
 */
const checkServiceSync = async (args, args, containerContext, tap, context) => {
  const {
    env,
    service,
    autoSync,
  } = args.params
  
  // Only create syncs in the development env
  const doSync = env !== 'production' &&
    (exists(autoSync) && autoSync !== false) &&
    (exists(service) && service === 'mutagen') &&
    !checkEnvConstantValue(containerContext.cmdContext, 'KEG_AUTO_SYNC', false)

  // Run the mutagen service if needed
  const currentContext = doSync
    ? await mutagenService(args, {
        tap: get(args, 'params.tap', tap),
        context: get(args, 'params.context', context),
      })
    : containerContext

  return { doSync, currentContext }
}

/**
 * Helper to log that a service was started
 * @function
 * @param {Object} args - Default task arguments passed from the runTask method
 * @param {Object} context - Context of the service that was started
 */
const logComposeStarted = (args, context, composeTask) => {
  Logger.empty()
  Logger.highlight(
    composeTask === 'restart' ? `Restarted` : `Started`,
    `"${ get(args, 'params.context', context) }"`,
    `compose environment!`
  )
  Logger.empty()
}

/**
 * Runs `docker-compose` up command based on the passed in args
 * @function
 * @param {Object} args - Default task arguments passed from the runTask method
 * @param {Object} exArgs - Extra arguments to run the service
 * @param {string} exArgs.context - The context to run the `docker-compose` command in
 * @param {string} exArgs.tap - Name of the tap to run the `docker-compose` command in
 *
 * @returns {*} - Response from the `docker-compose` up task
 */
const composeService = async (args, contextData, taskData) => {
  const { tap, context } = args.params
  contextData = contextData || getServiceContext(args)

  // If called from the restart task, we should run compose restart instead of compose up
  const composeTask = get(args, 'task.name', 'up')

  // Run the docker-compose task based on the original calling task
  const containerContext = await runInternalTask(
    `docker.tasks.compose.tasks.${composeTask}`,
    args
  )

  // Check if we should to a sync for the service we just started
  const { doSync, currentContext:composeContext} = await checkServiceSync(
    args,
    args,
    containerContext,
    tap,
    context
  )

  // Log that the compose service has been started
  logComposeStarted(args, context, composeTask)

  // Create any other syncs for the service based on the passed in sync param
  // If it's not an array, then skip
  const syncParam = get(args, 'params.sync')
  isArr(syncParam) &&
    syncParam.length &&
    await createSyncs(
      args,
      composeContext,
      exArgs
    )

  // Set a keg-compose service ENV 
  // This is added so we can know when were running the exec start command over
  // the initial docker run command
  // In cases where the container starts and runs for ever with tail -f dev/null
  set(composeContext, `contextEnvs.${KEG_DOCKER_EXEC}`, KEG_EXEC_OPTS.start)

  /**
  * Get the start command from the compose file or the Dockerfile
  * Update the default start cmd to just tail dev/null
  * Then run the real start command here
  * This allows us create syncs and update files
  * prior to running the app in the container
  * Connect to the service and run the start cmd
  */

  // The KEG_IMAGE_FROM env defines which image to use when starting the container
  // So use the KEG_IMAGE_FROM env to get the start cmd
  const { cmdContext, contextEnvs: { KEG_IMAGE_FROM } } = composeContext

  // Check if we should skip the docker exec command
  const internalSkipExec = get(args, '__internal.skipDockerExec')
  const skipDockerExec = exists(internalSkipExec)
    ? internalSkipExec
    : checkEnvConstantValue(cmdContext, 'KEG_AUTO_DOCKER_EXEC', false)

  return skipDockerExec
    ? composeContext
    : runInternalTask('tasks.docker.tasks.exec', deepMerge(args, {
        __internal: { containerContext: composeContext },
        params: {
          ...buildExecParams(
            args.params,
            { detach: Boolean(get(args, 'params.detach')) },
          ),
          cmd: await getContainerCmd({ context: cmdContext, image: KEG_IMAGE_FROM }),
          context: cmdContext,
        },
      }))

}

cliStore.service.set(constants.SERVICES.TAP_COMPOSE_SRV, composeService)

module.exports = {
  composeService
}
