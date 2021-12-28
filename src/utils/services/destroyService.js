const { Logger } = require('@keg-hub/cli-utils')
const { get, deepMerge } = require('@keg-hub/jsutils')
const { getServiceArgs } = require('./getServiceArgs')
const { runInternalTask } = require('../task/runInternalTask')

/**
 * Checks all option variations of remove image
 * If found then returns true
 * Not a great solution, but better then nothing
 * @param {Array<string>} options - Cmd line options passed to the original task
 * 
 * @return {boolean} - True if the image should be removed
 */
const checkImgRemoveOpts = options => {
  let hasRm
  return options.map(opt => {
    if(opt === `--remove` || opt === `--rm` || opt === `-r`){
      hasRm = true
      return
    }

    const hasImg = opt === `--image` ||
      opt === `-i` ||
      opt === `image=true` ||
      opt === `i=true`

    const inRmOpt = hasRm ||
      opt.includes(`rm=`) ||
      opt.includes(`remove=`) ||
      opt.includes(`r=`)

    return hasImg || (opt.includes(`images`) && inRmOpt)
  }).includes(true)
}

/**
 * Checks if the image option was passed in to remove the image
 * <br/>If it's found, then call the remove image task
 * @param {Object} serviceArgs - Merged arguments passed to destroyService
 *
 * @returns {void}
 */
const checkRemoveImage = serviceArgs => {
  const { options } = serviceArgs
  return !options || !options.length || !checkImgRemoveOpts(options)
    ? null
    : runInternalTask('docker.tasks.image.tasks.remove', serviceArgs)
}

/**
 * Destroys and removes a running docker-compose service
 * @param {Object} args - Default arguments passed to all tasks
 * @param {Object} argsExt - Extra args to override the default args
 *
 * @returns {void}
 */
const destroyService = async (args, argsExt) => {

  // build the internal arguments
  const serviceArgs = getServiceArgs(args, argsExt)

  // Bring down the docker-compose services and remove the docker-container
  await runInternalTask('docker.tasks.compose.tasks.down', deepMerge(serviceArgs, {
    params: { remove: get(serviceArgs, `params.remove`, `orphans,volumes`) }
  }))

  // Remove the image if option is passed in
  await checkRemoveImage(serviceArgs, args)

  // Terminate all mutagen sync process for the context type
  await runInternalTask('mutagen.tasks.clean', serviceArgs)

  Logger.highlight(
    `Destroyed`,
    `"${ serviceArgs.params.tap || serviceArgs.params.context }"`,
    `compose environment!`
  )
  Logger.empty()

}

module.exports = {
  destroyService
}