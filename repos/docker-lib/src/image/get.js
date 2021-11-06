const { isFunc } = require('@keg-hub/jsutils')
const { list } = require('./list')

/**
 * Searches current images for a name or id match
 * @function
 * @param {string} nameOrId - Name or id of the image to get
 * @param {function} findCb - Callback to filter images
 * @param {boolean} [log=false] - Should log output
 *
 * @returns {Object} - Found image match
 */
 const get = async (image, findCb, log=false) => {

  // Split the image and tag if : exits in the image name
  const [ imgName, tag ] = image.includes(':')
    ? image.split(':')
    : [ image ]
  
  // Get all current images
  const images = await list({ errResponse: [], format: 'json', log })

  // If we have images, try to find the one matching the passed in argument
  return images &&
    images.length &&
    images.find(image => {
      if(isFunc(findCb)) return findCb(image, imgName, tag)

      if(tag && (image.tag !== tag || !image.tags.includes(tag))) return false

      const hasMatch = image.id === imgName ||
        image.repository === imgName ||
        image.rootId === imgName

      return !hasMatch || (hasMatch && !tag)
        ? hasMatch
        : image.tag === tag || image.tags.includes(tag)
    })
}


module.exports = {
  get,
  getImage,
}
