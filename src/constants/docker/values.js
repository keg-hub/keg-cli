const path = require('path')
const { KEG_ENVS } = require('../envs')
const { isStr } = require('@keg-hub/jsutils')
const { fileSys } = require('@keg-hub/cli-utils')

const { getFoldersSync, pathExistsSync } = fileSys

/**
 * All folders in the CONTAINERS_PATH that have a Dockerfile
 * @internal
 * @array
 */
let __IMAGES

/**
 * Path to the Keg-CLI containers folder
 * @string
 */
const containersPath = KEG_ENVS.CONTAINERS_PATH || KEG_ENVS.KEG_PATH

/**
 * Finds all folders in the CONTAINERS_PATH that have a Dockerfile
 * Then and adds them to the __IMAGES array
 * @function
 *
 * @returns {Array} - built __IMAGES array
 */
const buildImages = () => {
  __IMAGES = getFoldersSync(containersPath)
    .filter(folder => {
      const containerPath = path.join(containersPath, folder)
      return pathExistsSync(path.join(containerPath, `Dockerfile`)) ||
        pathExistsSync(path.join(containerPath, `docker-compose.yml`))
    })

  return __IMAGES
}

/**
 * Injects an image into the __IMAGES array
 * @function
 * @param {string} image - Name of new image to inject
 */
const injectImage = image => {
  isStr(image) &&
    !__IMAGES.includes(image) &&
    __IMAGES.push(image)
}

/**
 * Docker values constants for re-use in other docker constants files
 * @object
 */
const values = {
  injectImage,
  containersPath,
}

/**
 * Gets the __IMAGES array if it's defined, or builds it
 * @function
 */
const getImages = () => (__IMAGES || buildImages())

/**
 * Defines the images property on the values object with a get method of getImages
 * <br/>Allows the getImages method to dynamically build the __IMAGES object at runtime
 * @function
 */
Object.defineProperty(values, 'images', {
  get: getImages,
  enumerable: true,
  configurable: false,
})

module.exports = Object.freeze(values)