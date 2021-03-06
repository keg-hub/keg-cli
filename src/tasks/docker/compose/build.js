const { Logger } = require('@keg-hub/cli-utils')
const { spawnCmd } = require('@keg-hub/spawn-cmd')
const { buildComposeCmd } = require('KegUtils/docker/compose/buildComposeCmd')
const { getComposeServiceName } = require('KegUtils/getters/getComposeServiceName')
const { buildContainerContext } = require('KegUtils/builders/buildContainerContext')

/**
 * Runs the docker-compose build command
 * @function
 * @param {Object} args - arguments passed from the runTask method
 * @param {Object} args.globalConfig - Global config object for the keg-cli
 *
 * @returns {void}
 */
const buildDockerCompose = async args => {
  const { globalConfig, __internal, params, task } = args
  const { log } = params

  // Get the context data for the command to be run
  const { location, cmdContext, contextEnvs } = await buildContainerContext({
    globalConfig,
    task,
    params
  })

  // Build the docker compose command
  const { dockerCmd } = await buildComposeCmd({
    params,
    cmdContext,
    contextEnvs,
    cmd: 'build',
    globalConfig,
  })

  // Get the name of the docker-compose service
  const serviceName = getComposeServiceName(cmdContext, contextEnvs)

  log &&
    !Boolean(__internal) &&
    Logger.pair(`Running command: `, `${dockerCmd} ${serviceName}`)

  // Run the docker compose build command
  await spawnCmd(
    `${dockerCmd} ${serviceName}`,
    {options: {env: contextEnvs}, cwd: location}
  )

  log && Logger.highlight(`Compose build service`, `"${ cmdContext }"`, `complete!`)

}

module.exports = {
  build: {
    name: 'build',
    alias: [ 'b' ],
    action: buildDockerCompose,
    description: `Run docker-compose build command`,
    example: 'keg docker compose build <options>',
    options: {
      context: {
        description: 'Context of docker compose build command (tap || core)',
        example: 'keg docker compose build --context core',
        default: 'base'
      },
      clean: {
        alias: [ 'remove' ],
        description: 'Always remove intermediate containers',
        example: 'keg docker compose build --clean',
        default: true
      },
      cache: {
        description: 'Use cache when building the container',
        example: 'keg docker compose build --cache',
        default: true
      },
      local: {
        description: 'Copy the local repo into the docker container at build time. Dockerfile must support KEG_COPY_LOCAL env. Overrides globalConfig setting!',
        example: `keg docker compose build --local`,
      },
      log: {
        description: 'Log the compose command to the terminal',
        example: 'keg docker compose build --log false',
        default: true,
      },
      pull: {
        description: 'Always attempt to pull a newer version of the image',
        example: 'keg docker compose build --pull',
        default: true
      }
    }
  }
}
