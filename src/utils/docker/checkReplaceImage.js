const docker = require('@keg-hub/docker-lib')
const { ask } = require('@keg-hub/ask-it')
const { Logger } = require('@keg-hub/cli-utils')

/**
 * Checks if an image already exists with the passed in tag
 * <br/> If it does, asks user if they want to remove it
 * @function
 * @param {string} imgWTag - Image name plus the commit tag
 * @param {string} commitTag - Tag to use when creating the image
 *
 * @returns {boolean} - false is the image does not already exist
 */
const checkReplaceImage = async (imgWTag, commitTag) => {
  const exists = await docker.image.getByTag(commitTag)
  if(!exists) return

  Logger.empty()
  Logger.highlight(`Image`,`"${ imgWTag }"`, `already exists...`)
  Logger.empty()

  const replace = await ask.confirm(`Would you like to replace it?`)
  replace && await docker.image.removeTag({ image: exists, tag: commitTag })

  // Return the opposite of replace because we want to know if the image exist
  // If not replace, then the image still exists
  return !replace

}


module.exports = {
  checkReplaceImage
}