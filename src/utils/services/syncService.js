const { actionService } = require('./actionService')
const { getServiceArgs } = require('./getServiceArgs')
const { getContextEnv } = require('@keg-hub/docker-lib')
const { generalError } = require('../error/generalError')
const { get, noOpObj, isStr } = require('@keg-hub/jsutils')
const { parseActionName } = require('../actions/parseActionName')
const { buildContainerContext } = require('../builders/buildContainerContext')
const { getRepoPath, Logger, runInternalTask } = require('@keg-hub/cli-utils')


/**
 * Gets the path in the docker container the sync will use
 * @param {Object} globalConfig - Global config object for the keg-cli
 * @param {string} context - Context or name of the container to get the remote path from
 * @param {string} dependency - Name contained in an ENV that defines the path in docker
 * @param {string} remote - Path in the docker container where the sync will be created
 *
 * @returns {string}
 */
const getRemotePath = async (globalConfig, context, dependency, remote) => {
  return remote || await getContextEnv(
    context,
    `DOC_${ dependency.toUpperCase() }_PATH`,
    undefined,
    globalConfig
  )
}

/**
 * Gets the local path the sync will use
 * @param {Object} globalConfig - Global config object for the keg-cli
 * @param {string} context - Context or name of the container to get the remote path from
 * @param {string} local - Local path where the sync will be created
 * @param {string} dependency - Name contained in an ENV that defines the path in docker
 *
 * @returns {string}
 */
const getLocalPath = async (globalConfig, context, dependency, local) => {
  return local || await getContextEnv(
    context,
    `${ dependency.toUpperCase() }_PATH`,
    getRepoPath(dependency, globalConfig),
    globalConfig
  )
}

/**
 * Builds a mutagen sync between local and a docker container
 * @param {Object} args - arguments passed from the runTask method
 * @param {Object} args.globalConfig - Global config object for the keg-cli
 * @param {Object} args.params - Formatted object of the passed in options 
 * @param {string} params.container - Name of the container to run ( core / tap )
 * @param {string} params.tap - Name of tap, if container arg value is `tap`
 * @param {string} params.location - Location where the command should be run
 *
 * @returns {void}
 */
const buildContainerSync = async (args, argsExt) => {
  const serviceArgs = getServiceArgs(args, argsExt)

  const { globalConfig, params, __internal={} } = serviceArgs
  const { local, remote } = params
  const { actionOnly } = __internal

  const [dependency, ...syncActions] = params.dependency.includes(':')
    ? params.dependency.split(':')
    : [params.dependency]

  const containerContext = await buildContainerContext(serviceArgs)
  const { context, id } = containerContext

  const localPath = await getLocalPath(globalConfig, context, dependency, local)
  !localPath && generalError(`Local path could not be found!`)

  const remotePath = await getRemotePath(globalConfig, context, dependency, remote)
  const dependencyName = parseActionName(dependency, remotePath)

  // Create the mutagen sync
  const mutagenContext = await runInternalTask('mutagen.tasks.create', {
    ...serviceArgs,
    ...(containerContext && {
      __internal: {
        actionOnly,
        containerContext,
        skipExists: true,
        skipLog: true
      }
    }),
    params: {
      ...serviceArgs.params,
      context,
      container: id,
      local: localPath,
      remote: remotePath,
      name: `${ context }-${ dependencyName }`
    },
  })

  // Run any actions after the mutagen sync is crated
  syncActions.length &&
    await actionService({
      ...serviceArgs,
      __internal: {
        ...serviceArgs.__internal,
        containerContext: mutagenContext
      },
      params: {
        ...serviceArgs.params,
        action: params.dependency,
      }
    })

  return mutagenContext
}

/**
 * Checks the params.dependency for syncs to run
 * Calls buildSync for any found syncs
 * @param {Object} args - arguments passed from the runTask method
 * @param {Object} args.globalConfig - Global config object for the keg-cli
 * @param {Object} args.params - Formatted object of the passed in options 
 * @param {string} params.container - Name of the container to run ( core / tap )
 * @param {string} params.tap - Name of tap, if container arg value is `tap`
 * @param {string} params.location - Location where the command should be run
 *
 * @returns {void}
 */
const syncService = async (args, { container }) => {
  const dependency = get(args, 'params.dependency')
  if(!isStr(dependency))
    return Logger.error(`The "dependency" option must a comma separated list of named dependencies`)

  const toSync = dependency.indexOf(',') !== -1
    ? dependency.split(',')
    : [dependency]
  
  return toSync.reduce(async (toResolve, dep) => {
    const resolved = await toResolve
    return buildContainerSync(args, { container, ...args.params, dependency: dep })
  }, Promise.resolve(noOpObj))
}

module.exports = {
  buildContainerSync,
  syncService
}
