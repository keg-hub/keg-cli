const { compareItems } = require('../utils/compareItems')
const { list } = require('./list')


/**
 * Checks if an image already exists ( is built )
 * @function
 * @param {string} compare - Value to compare each container with
 * @param {string|function} doCompare - How to compare each container
 * @param {string|function} format - Format of the docker command output
 *
 * @returns {boolean} - Based on if the image exists
 */
const exists = async (compare, doCompare, log) => {
  // Get all current images
  const images = await list({ errResponse: [], format: 'json', log })

  // If we have images, try to find the one matching the passed in argument
  return images &&
    images.length &&
    images.reduce((found, image) => {
      return found ||
        compareItems(image, compare, doCompare, [ 'id', 'repository' ]) &&
        image
    }, false)

}

module.exports = {
  exists
}