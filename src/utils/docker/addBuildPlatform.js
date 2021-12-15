const { exists, noOpObj } = require('@keg-hub/jsutils')
const { getContainerConst } = require('./getContainerConst')

const platformMap = {
  amd: `linux/amd64`,
  arm: `linux/arm64`,
  all: `linux/amd64,linux/arm64`
}

/**
 * Gets the platforms to use during the build process
 * Looks in the param.platform, container.envs.KEG_BUILD_PLATFORMS
 * Or uses the default `linux/amd64,linux/arm64`
 * If param.platform of container.envs.KEG_BUILD_PLATFORMS is set to false,
 * no platforms will be included
 */
const getPlatforms = params => {
  const { context, platform } = params
  const paramPlatform = platformMap[platform] || platform
  const platformsEnv = getContainerConst(context, `ENV.KEG_BUILD_PLATFORMS`)

  const platforms = exists(paramPlatform)
    ? paramPlatform
    : exists(platformsEnv)
      ? platformsEnv
      : `linux/amd64,linux/arm64`

  return platforms.startsWith(`--platform`)
    ? platforms
    : `--platform ${platforms}`
}

/**
 * Add the platform argument based on the passed in platform option or uses the default all
 * @function
 * @param {string} dockerCmd - Docker command to add the compile file paths to
 * @param {string} toAdd - The arguments to be added to the docker command
 * @param {string|boolean} value - Passed in platform option value, If false, platform argument is not added
 *
 * @returns {string} - dockerCmd string with the file paths added
 */
 const addBuildPlatform = (dockerCmd, params=noOpObj) => { 
  const { buildX, push } = params

  // If we are pushing, then add the platforms,
  // Otherwise add the load argument
  // Docker does not allow loading multi-platform images locally
  // So it's not included if push is not set
   return !buildX
    ? dockerCmd
    : push
      ? `${dockerCmd} ${getPlatforms(params)}`.trim()
      : `${dockerCmd} --load`.trim()
}

module.exports = {
  addBuildPlatform
}