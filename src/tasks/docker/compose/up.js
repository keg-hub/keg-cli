const { pickKeys } = require('@keg-hub/jsutils')
const { logVirtualUrl } = require('KegUtils/log')
const { spawnCmd } = require('@keg-hub/spawn-cmd')
const { buildContainerContext } = require('KegUtils/builders')
const { Logger, runInternalTask } = require('@keg-hub/cli-utils')
const { throwComposeFailed } = require('KegUtils/error/throwComposeFailed')
const { mergeTaskOptions } = require('KegUtils/task/options/mergeTaskOptions')
const { buildComposeCmd } = require('KegUtils/docker/compose/buildComposeCmd')

const buildDockerImg = async (args, cmdContext, tap) => {
  return await runInternalTask(`tasks.docker.tasks.build`, {
    ...args,
    params: { ...args.params, context: cmdContext },
  })
}

const pullDockerImg = async (args, cmdContext, tap) => {
  return await runInternalTask('docker.tasks.compose.tasks.pull', { 
    ...args,
    params: { ...args.params, context: cmdContext, tap },
  })
}

/**
 * Runs docker-compose up command for (core | tap)
 * @function
 * @param {Object} args - arguments passed from the runTask method
 * @param {Object} args.globalConfig - Global config object for the keg-cli
 *
 * @returns {void}
 */
const composeUp = async args => {
  const { globalConfig, __internal, params } = args
  const { build, pull, log, recreate } = params

  // Get the context data for the command to be run
  const containerContext = await buildContainerContext(args)
  const { location, cmdContext, contextEnvs } = containerContext

  // Check if we should build the image
  build && await buildDockerImg(args, cmdContext)

  // Check if we should pull the image
  pull && await pullDockerImg(args, cmdContext)

  // Build the docker compose command
  const { dockerCmd, composeData } = await buildComposeCmd({
    cmd: 'up',
    cmdContext,
    contextEnvs,
    globalConfig,
    // Default no-recreate to true, if recreate is falsy
    params: {
      ...params,
      ...(!recreate && { nocreate: true })
    },
  })

  log &&
    !Boolean(__internal) &&
    Logger.pair(`Running command: `, dockerCmd)
  
  // Run the docker-compose up command
  const cmdFailed = await spawnCmd(
    dockerCmd,
    {options: {env: contextEnvs}, cwd: location},
  )

  // Returns 0 if the command is successful, which is falsy
  // So check for truthy value, which means the command failed
  cmdFailed && throwComposeFailed(dockerCmd, location)

  log && Logger.highlight(`Compose service`, `"${ cmdContext }"`, `is up!`)

  // Log the virtual url so users know how to access the running containers
  logVirtualUrl(composeData, contextEnvs.KEG_PROXY_HOST)

  // Return the built context info, so it can be reused if needed
  return containerContext

}

module.exports = {
  up: {
    name: 'up',
    alias: [ 'u' ],
    action: composeUp,
    description: `Run docker-compose up command`,
    example: 'keg docker compose up <options>',
    options: pickKeys(
      mergeTaskOptions('docker compose', 'up', 'startService', {
        context: {
          description: 'Context of docker compose up command (core || tap)',
          example: 'keg docker compose up --context core',
          required: true
        }
      }),
      [
        'build',
        'cache',
        'command',
        'context',
        'destroy',
        'detached',
        'docker',
        'follow',
        'from',
        'install',
        'log',
        'local',
        'recreate',
        'pull',
      ]
    )
  }
}