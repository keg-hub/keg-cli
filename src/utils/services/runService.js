const { proxyService } = require('./proxyService')
const { get, deepMerge } = require('@keg-hub/jsutils')
const { getServiceArgs } = require('./getServiceArgs')
const { runInternalTask } = require('@keg-hub/cli-utils')
const { throwContainerNotFound } = require('KegUtils/error/throwContainerNotFound')

/**
 * A service to run a container directly, but overwrite the entry point
 * <br/>Also creates a sync with the local repo when the sync param is true
 * @function
 * @param {Object} args - Default task arguments passed from the runTask method
 * @param {Object} argsEXT - Extra arguments to run the service
 * @param {string} argsEXT.context - The context to run the `docker-compose` command in
 * @param {string} argsEXT.tap - Name of the tap to run the `docker-compose` command in
 *
 * @returns {*} - Response from the compose service
 */
const runService = async (args, exArgs) => {
  const { context, tap } = exArgs
  
  // Build the service arguments
  const serviceArgs = getServiceArgs(args, exArgs)
  const { params } = serviceArgs
  const { sync, local, remote, connect, cmd } = params

  // Call the proxy service to make sure that is running
  await proxyService(args)

  // Step 1 - Run the docker container, but don't attach to it
  // We do this so we can create a mutagen sync after the container has been started
  const { imageContext, containerRef } = await runInternalTask(
    'docker.tasks.image.tasks.run',
    deepMerge(args, {
      __internal: { skipExists: true },
      params: {
        // set the cmd to tail /dev/null to keep the container running
        // connect: false,
        // TODO: Fix this so we can keep the container running
        // Right now tail -f /dev/null fails, so commenting out
        // cmd: '/bin/bash',
        // cmd: 'tail -f /dev/null',
        tap,
        context,
      }
    })
  )

  return imageContext

  if((!sync && connect) || connect) return imageContext

  // Step 2 - Create a mutagen sync between the local repo and the docker container  
  // If no container exists, if means the container started and stopped right away
  // So throw that not found error
  !containerRef && throwContainerNotFound(container)


  // // Build the container context, so the values are cache on calls to buildContainerContext
  const syncName = `img-${ context }-run`
  // TODO: clean this up. Should not be merging the container ref with imageContext
  const containerContext = { cmdContext: context, ...imageContext, ...containerRef }
  
  // Check if we should sync the local repo to the container
  const syncContext = sync
    ? await runInternalTask('mutagen.tasks.create', deepMerge(args, {
        __internal: {
          containerContext,
          skipExists: true,
        },
        params: {
          tap,
          context,
          container,
          name: syncName,
          local: local || get(imageContext, `contextEnvs.KEG_CONTEXT_PATH`),
          remote: remote || get(imageContext, `contextEnvs.DOC_APP_PATH`),
        }
      }))
    : containerContext

  // Step 3 - Attach to the container as if we didn't run it in the background
  await runInternalTask('tasks.docker.tasks.exec', deepMerge(args, {
    __internal: { containerContext },
    params: {
      tap,
      context,
      options: ['--rm', '-it'],
    },
  }))

  // Step 4 - Clean up the container sync after the user has disconnected

  // Terminate all mutagen sync process for the context type
  await runInternalTask('mutagen.tasks.clean', deepMerge(serviceArgs, {
    params: {
      context: syncName,
      force: true,
    }
  }))

}


module.exports = {
  runService
}