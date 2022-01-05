const { get } = require('@keg-hub/jsutils')
const { getCommitTag } = require('KegUtils/package/getCommitTag')
const { getImgNameContext } = require('KegUtils/getters/getImgNameContext')

/**
 * Gets the correct image tags to be used to when creating the image
 * @function
 * @param {Object} params - Formatted options as an object
 * @param {string} location - Location of the repo the image is being created from
 * @param {string} tag - Custom tag to override the default tags
 *
 * @returns {Object} - Contains the image tags to use when creating
 */
 const getImgTags = async (params, location, defType='package-') => {
  const overrideTag = get(params, 'tag', get(params, 'tags', [])[0])

  // Get passed in tag, or the first tag from tags array or branch name at the location
  const tag = overrideTag || (location && await getCommitTag(location))

  // If none found, use the current time
  const commitTag = (tag || defType + Date.now()).toLowerCase()

  // Get the imgNameContext, with the custom commitTag
  const imgNameContext = await getImgNameContext({ ...params, tag: commitTag })

  // Check if the image already exist
  // So we can ask if it should be replaced
  // Also clean it so it can be used as a url with keg-proxy
  const cleanedTag = imgNameContext.tag
    .toLowerCase()
    .replace(/[&\/\\#, +()$~%.'"*?<>{}]/g, '-')

  const imgWTag = `${imgNameContext.providerImage}:${cleanedTag}`

  return {
    imgWTag,
    cleanedTag,
    commitTag,
    imgNameContext
  }
}

module.exports = {
  getImgTags
}