
/**
 * Allow platform build types
 * Node arch => 'ia32', 'mips', 'mipsel', 'ppc', 'ppc64', 's390', 's390x', 'x32', and 'x64'.
 * Docker arch => linux/riscv64, linux/ppc64le, linux/s390x, linux/386, linux/arm/v7
 * @type {Object}
 */
const platforms = {
  amd: `amd64`,
  amd64: `amd64`,
  arm: `arm/v7,arm64/v8`,
  arm32: `arm/v7`,
  arm64: 'arm64',
  all: `arm/v7,arm64/v8,amd64`,
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
  // // Loop over value, env, and the current process
  // // If any of them match exist in the platforms object then use it
  const arch = ([value, process.env.KEG_ARCH_TYPE, process.arch]).reduce((found, item) => (
    found || (item && platforms[item])
  ), false)

  return Object.values(platforms).includes(arch)
    ? `${dockerCmd} --platform ${arch}`
    : dockerCmd
}

module.exports = {
  addBuildPlatform
}