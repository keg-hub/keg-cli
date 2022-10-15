const docker = require('@keg-hub/docker-lib')
const { Logger } = require('@keg-hub/cli-utils')
const { get } = require('@keg-hub/jsutils')
const { CONTAINERS } = require('KegConst/docker/containers')

const getFormat = (params) => {
  const { json, js, short, sm, format } = params
  return json || js
    ? `json`
    : short || sm
      ? `short`
      : format || ``
}

const logImages = (res, params) => {
  Logger.empty()
  
  const format = getFormat(params)
  if(!format || format === `json`) return Logger.data(res)


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
  cmdArgs.format = getFormat(params)

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
