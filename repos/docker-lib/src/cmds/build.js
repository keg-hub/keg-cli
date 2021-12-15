const { noOpArr, noOpObj } = require('@keg-hub/jsutils')
const { apiError } = require('../utils/error/apiError')
const { Logger, runCmd } = require('@keg-hub/cli-utils')
const { ensureDocker } = require('../utils/ensureDocker')

/**
 * Builds a Docker command to be run in a child process
 * @param {string} cmd - The docker build command to run including the `build`
 * @param {Object} options - Options for building the docker image
 * @param {boolean} options.log - Log the docker cmds before running them
 * @param {Array} options.args - Arguments for the docker build command
 * @param {string} [options.context] - The name of the item running the build cmd for
 * @param {Array} options.cwd - Location where the command should be run, overrides location
 * @param {Array} options.* - Extra arguments to pass to the spawned child process
 * @param {Array} location - Location where the command should be run
 */
const build = async (cmd, options=noOpObj, location) => {
  const { log=true, context, args=noOpArr, buildX, ...cmdOpts } = options

  // Check if buildX should be included
  // The array seems backwards, but its correct
  // It's the order in which the action is added to the command
  // build is added first, then buildx === `docker buildx build --push ...`
  // Push is automatically added because
  // buildx requires it the image being pushed to automatically join the platform manifests
  const withBuildX = buildX ? [`--push`, `build`, `buildx`] : [`build`]

  // Build the command to be run
  const cmdToRun = ensureDocker(cmd, withBuildX)

  log && Logger.spacedMsg(`Running command: `, cmdToRun)

  // Run the docker command
  const exitCode = await runCmd(
    cmdToRun,
    args,
    { ...cmdOpts, cwd: cmdOpts.cwd || location }
  )

  ;exitCode
    ? apiError(`${context || 'Docker'} image failed to build!`.trim())
    : log && Logger.pair(`Finished building image`, `${context || ''}`.trim())

  Logger.empty()

  return exitCode
}

module.exports = {
  build
}