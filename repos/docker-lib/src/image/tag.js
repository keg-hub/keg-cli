const { get } = require('./get')
const { list } = require('./list')
const { Logger } = require('@keg-hub/cli-utils')
const { dockerCli } = require('../cmds/dockerCli')
const { isStr, isObj } = require('@keg-hub/jsutils')
const { noItemFoundError } = require('../utils/error/noItemFoundError')

/**
 * Tags an image with the passed in imgTag
 * @function
 * @param {Object|string} args - Arguments to tag an image || an Image identifier
 * @param {string} args.item - Image identifier; either name or id
 * @param {string} args.tag - Tag to add to the image
 * @param {string} args.log - Log the output of the docker image tag command
 * @param {string} imgTag - Tag to add to the image. Used when args is a string
 *
 * @returns {*} - Output of the docker image tag command
 */
const tag = async (args, imgTag) => {

  // Allow calling the tagImage with a string image name and string imgTag
  args = isStr(args) ? { item: args, tag: imgTag } : args

  // Pull the needed params from the args object
  const { item, tag, log, provider } = args

  // Get the image as an object
  let image = isObj(args.image) ? args.image : await getImage(item)

  // If no image is found, then throw
  !image && noItemFoundError('image', image)

  const opts = provider
    ? [ 'tag', image.id, tag ]
    : [ 'tag', image.id, `${image.rootId}:${tag}` ]

  // Add the tag to the image
  return dockerCli({
    ...args,
    opts,
    format: '',
  })
}

/**
 * Un-tags an image with the passed in imgTag
 * @function
 * @param {Object|string} args - Arguments to tag an image || an Image identifier
 * @param {string} args.item - Image identifier; either name or id
 * @param {string} args.tag - Tag to add to the image
 * @param {string} args.log - Log the output of the docker image tag command
 * @param {string} imgTag - Tag to add to the image. Used when args is a string
 *
 * @returns {*} - Output of the docker image tag command
 */
const removeTag = async (args, imgTag) => {
  // Allow calling the removeTag with a string image name and string imgTag
  args = isStr(args) ? { item: args, tag: imgTag } : args

  // Pull the needed params from the args object
  const { item, tag, log } = args

  // Ensure a tag exists
  if(!tag)
    return Logger.error(`A tag argument is required to be able to remove it`)

  // Get the image as an object
  let image = args.image || await get(item)

  // If no image, then just throw
  !image && noItemFoundError('image', image)

  // Use the repository as the name if it's a pull url
  const imgName = image.repository.includes('/') ? image.repository : image.rootId

  return dockerCli({
    ...args,
    format: '',
    opts: [ 'rmi', `${imgName}:${tag}` ]
  })
}


/**
 * Searches current images for a tag match
 * @function
 * @param {string} tag - Tag of the image to get
 *
 * @returns {Object} - Found image match
 */
const getByTag = async (imgRef, log=false) => {
  // Get all current images
  const images = await list({ errResponse: [], format: 'json', log })

  // If we have images, try to find the one matching the passed in argument
  return images &&
    images.length &&
    images.find(image => image.tag === imgRef)
}


module.exports = {
  tag,
  getByTag,
  removeTag,
}