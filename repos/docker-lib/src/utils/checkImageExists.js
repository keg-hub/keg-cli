const { get:imgGet } = require('../image/get')
const { error } = require('@keg-hub/cli-utils')
const { noOpObj } = require('@keg-hub/jsutils')
const { getImgNameContext } = require('../context/getImgNameContext')

/**
 * Checks if a docker image already exists locally
 * @function
 * @param {string} params.context - Context or name of the container to check
 * @param {string} params.image - Name of image to check for
 * @param {string} params.tag - Tag of image to check for
 *
 * @returns {Boolean} - If the docker image exists
 */
const checkImageExists = async (params=noOpObj, contextData=noOpObj) => {
  const { context, image } = params

  // Use the image or the context
  const searchFor = image || context || contextData.name
  // If no image or context then throw
  !searchFor && error.generalError(`checkImageExists util requires a context or image argument!`)

  // Get the image name context,
  // So we can search for the image with tag and the full provider
  const { imageWTag, providerImage } = await getImgNameContext(params)

  let exists = await imgGet(imageWTag)

  exists = exists || await imgGet(providerImage)

  return Boolean(exists) ? exists : false
}

module.exports = {
  checkImageExists
}
