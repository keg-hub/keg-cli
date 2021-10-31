
/**
 * Allow platform build types
 * @type {Object}
 */
const platforms = {
  amd: `linux/amd64`,
  amd64: `linux/amd64`,
  arm: `linux/arm/v7,linux/arm64/v8`,
  arm32: `linux/arm/v7`,
  arm64: `linux/arm64/v8`,
  all: `linux/arm/v7,linux/arm64/v8,linux/amd64`,
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
 const addBuildPlatform = (dockerCmd, value) => {
  return !value
    ? dockerCmd
    : `${dockerCmd} --platform ${platforms[value] || value}`
}

module.exports = {
  addBuildPlatform
}