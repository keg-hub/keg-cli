const { get } = require('./get')
const { raw } = require('../cmds/raw')
const { Logger } = require('@keg-hub/cli-utils')
const { isArr, isStr } = require('@keg-hub/jsutils')
const { isDockerId } = require('../utils/isDockerId')
const { toContainerEnvs } = require('../utils/containerEnvs')

/**
 * Gets an images name from it's ID
 * @function
 * @param {string} id - Docker image id
 *
 * @returns {string} - Built image name
 */
 const getNameFromId = async id => {
  const imgRef = await get(id)
  return imgRef && `${imgRef.repository}:${imgRef.tag}`
}

/**
 * Builds the names for a container and image based on the passed in params
 * @function
 * @param {Object} args - Use to build the names
 * @param {string} args.image - Image Object returned from get image
 * @param {string} args.name - Custom name for the container
 * @param {string} args.tag - Tag of the image
 *
 * @returns {Object} - Contains the container and image names
 */
 const buildNames = ({ image, name, tag }) => {
  const container = isStr(name) ? name : `img-${image}`

  // Parse the tag form the image name if it exists
  const [ imgName, altTag ] = image.includes(':') ? image.split(':') : [ image ]

  // Use the custom tag if it exists
  const imgTag = tag || altTag
  const nameWTag = imgTag ? `${imgName}:${imgTag}` : imgName

  return { container, image:nameWTag }
}

/**
 * Runs a built image as a container
 * @function
 * @param {Object} args - Arguments to pass to run the docker run command
 * @param {string} args.cmd - Overwrite the default cmd of the image
 * @param {Object} args.envs - Envs to pass to the container when run
 * @param {string|Object} args.image - Image object or image name to be run
 * @param {string} args.location - The location where the docker run command will be executed
 * @param {string} args.name - Name of the docker container
 * @param {Array} args.opts - Extra docker cli options to pass to the run command
 * @param {Array} args.ports - Host ports to mount to the container
 *
 * @returns {string|Array} - Response from docker cli
 */
 const run = async (args) => {
  const {
    cmd,
    entry,
    envs,
    location,
    log,
    name,
    network,
    opts=[],
    ports=[],
    remove,
    tag
  } = args

  const image = isDockerId(args.image)
    ? await getNameFromId(args.image)
    : args.image

  // Build the names for the container and image
  const names = buildNames({ image, name, tag })

  // Set the name of the container based off the image name
  let cmdToRun = `docker run --name ${ names.container }`.trim()

  network && opts.push(`--network ${network}`)
  remove && opts.push(`--rm`)

  isArr(ports) &&
    ports.map(port => (
      port.includes(':') 
        ? opts.push(`-p ${port}`) 
        : opts.push(`-p ${port}:${port}`)
    ))

  // Add any passed in docker cli opts 
  cmdToRun = `${ cmdToRun } ${ opts.join(' ') }`.trim()

  // Convert the passed in envs to envs that can be passed to the container
  cmdToRun = toContainerEnvs(envs, cmdToRun)
  
  // Get the container run command
  const containerCmd = cmd || ''

  // Check for entrypoint override
  cmdToRun = entry ? `${cmdToRun} --entrypoint ${entry}` : cmdToRun

  // Check for command override
  cmdToRun = `${ cmdToRun.trim() } ${ names.image.trim() } ${ containerCmd.trim() }`.trim()

  log && Logger.spacedMsg(`Running command: `, cmdToRun)

  // Run the command
  return raw(cmdToRun, { options: { env: envs }}, location)

}

module.exports = {
  run,
}