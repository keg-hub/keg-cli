const { list } = require('./list')
const { dockerCli } = require('../cmds/dockerCli')


/**
 * Removes all un-tagged and un-named images
 * @function
 * @param {string} args - Arguments to pass to the docker image command
 * @param {string} args.opts - Options used to build the docker command
 *
 * @returns {boolean} - If the images can be removed
 */
const clean = async ({ force, opts='', log=false }) => {
  const IMG_NONE = `<none>`

  // Get all current images
  const images = await list({ errResponse: [], format: 'json', log })

  // Find the images to be removed
  const toRemove = images.reduce((toRemove, image) => {
    (image.repository === IMG_NONE || image.tag === IMG_NONE) &&
      ( toRemove += ` ${ image.id }`)

    return toRemove
  }, '').trim()

  return toRemove && dockerCli({
    force,
    opts: ['image', 'rm'].concat([ toRemove, opts ]),
  })

}

module.exports = {
  clean
}