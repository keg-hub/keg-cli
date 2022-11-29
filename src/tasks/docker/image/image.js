const docker = require('@keg-hub/docker-lib')
const { get } = require('@keg-hub/jsutils')
const { Logger } = require('@keg-hub/cli-utils')
const { CONTAINERS } = require('KegConst/docker/containers')

const getFormat = (params) => {
  const { json, js, short, sm, format } = params
  return json || js
    ? `json`
    : short || sm
      ? `short`
      : format || ``
}

const logImages = (images, params) => {
  Logger.empty()

  const format = getFormat(params)
  if(!format || format !== `short` || !Array.isArray(images)) return Logger.data(images)

  const idH = `Id              `
  const sizeH = `Size       `
  const imgH = `Image:Tag                                `
  Logger.green(`${idH}${sizeH}${imgH}`)

  images.forEach(img => {

    let id = img.id.substring(0, 15)
    if(img.id.length > 15) id = `${img.id.substring(0, 12)}...`
    Array.apply(' ', Array(15 - id.length)).forEach(() => id += ` `)

    let size = img.size.substring(0, 10)
    if(img.size.length > 10) size = `${img.size.substring(0, 7)}...`
    Array.apply(' ', Array(10 - size.length)).forEach(() => size += ` `)
  
    let imageT = `${img.repository}:${img.tag}`
    if(imageT.length > 70) imageT = `${imageT.substring(0, 57)}...`
    Logger.log(`${id} ${size} ${imageT}`)
  })
}

/**
 * Run a docker image command
 * @param {Object} args - arguments passed from the runTask method
 * @param {string} args.command - Initial command being run
 * @param {Array} args.options - arguments passed from the command line
 * @param {Object} args.tasks - All registered tasks of the CLI
 * @param {Object} globalConfig - Global config object for the keg-cli
 *
 * @returns {void}
 */
const dockerImage = async args => {
  const { params } = args
  const { cmd, name } = params
  const image = name && get(CONTAINERS, `${name.toUpperCase()}.ENV.IMAGE`)

  const cmdArgs = { ...params }
  const format = getFormat(params)
  if(format === 'json' || format === 'short') cmdArgs.format = 'json'

  cmdArgs.opts = cmd
    ? image
      ? [ cmd, image ]
      : [ cmd ]
    : [ 'ls' ]

  const res = await docker.image(cmdArgs)
  // Log the output of the command
  logImages(res, cmdArgs)

  return res

}

module.exports = {
  image: {
    name: 'image',
    alias: [ 'img', 'i', 'di' ],
    action: dockerImage,
    tasks: {
      ...require('./clean'),
      ...require('./get'),
      ...require('./remove'),
      ...require('./run'),
      ...require('./tag'),
    },
    description: `Runs docker image command`,
    example: 'keg docker image <options>',
    options: {
      cmd: {
        description: 'Docker image command to run. Default ( ls )',
        example: 'keg docker image ls',
      },
      name: {
        description: 'Name of the container to run the command on',
        example: 'keg docker image --name core',
      },
      force: {
        description: 'Add the force argument to the docker command',
        example: 'keg docker image --force ',
      },
      json: {
        alias: ['js'],
        description: 'Format docker image output to JSON',
        example: 'keg docker image --json ',
      },
      short: {
        alias: ['sm'],
        default: true,
        description: 'Format docker image output to short output',
        example: 'keg docker image --short',
      },
      format: {
        allowed: [ 'json', 'js', `short`, 'sm' ],
        description: 'Change output format of docker cli commands',
        example: 'keg docker image --format json ',
      },
    },
  }
}
