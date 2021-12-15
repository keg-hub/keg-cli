const { getContainerConst } = require('./getContainerConst')

/**
 * Add the platform argument based on the passed in platform option or uses the default all
 * @function
 * @param {string} dockerCmd - Docker command to add the compile file paths to
 * @param {string} toAdd - The arguments to be added to the docker command
 * @param {string|boolean} value - Passed in platform option value, If false, platform argument is not added
 *
 * @returns {string} - dockerCmd string with the file paths added
 */
 const addBuildPlatform = (dockerCmd, value) => {
  
  const platforms = value ||
    getContainerConst(context, `ENV.KEG_BUILD_PLATFORMS`) ||
    `--platform linux/amd64,linux/arm64`

   return `${dockerCmd} --platform ${platforms}`
}

module.exports = {
  addBuildPlatform
}