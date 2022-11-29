const { get } = require('@keg-hub/jsutils')
const docker = require('@keg-hub/docker-lib')
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

const logContainers = (containers, params) => {
  Logger.empty()

  const format = getFormat(params)
  if(!format || format !== `short` || !Array.isArray(containers)) return Logger.data(containers)

  const idH = `Id              `
  const stateH = `State      `
  const portsH = `Ports         `
  const nameH = `Name                                `
  Logger.green(`${idH}${stateH}${portsH}${nameH}`)

  containers.forEach(cont => {
    let id = cont.id.substring(0, 15)
    if(cont.id.length > 15) id = `${cont.id.substring(0, 12)}...`
    Array.apply(' ', Array(15 - id.length)).forEach(() => id += ` `)

    let state = cont.state.substring(0, 10)
    if(cont.state.length > 10) state = `${cont.state.substring(0, 7)}...`
    Array.apply(' ', Array(10 - state.length)).forEach(() => state += ` `)
    
    let ports = cont.ports
      ? cont.ports.substring(0, 13)
      : `N/A         `
    if(cont.ports.length > 13) ports = `${cont.ports.substring(0, 10)}...`
    Array.apply(' ', Array(13 - ports.length)).forEach(() => ports += ` `)


    let name = cont.name.substring(0, 50)
    if(cont.name.length > 50) name = `${cont.name.substring(0, 47)}...`
    Array.apply(' ', Array(50 - name.length)).forEach(() => name += ` `)

    Logger.log(`${id} ${state} ${ports} ${name}`)
  })
}

/**
 * Run a docker container command
 * @param {Object} args - arguments passed from the runTask method
 * @param {string} args.command - Initial command being run
 * @param {Array} args.options - arguments passed from the command line
 * @param {Object} args.tasks - All registered tasks of the CLI
 * @param {Object} globalConfig - Global config object for the keg-cli
 *
 * @returns {void}
 */
const dockerContainer = async args => {
  const { options, params } = args
  let { cmd, name, force } = params
  let container = name && get(CONTAINERS, `${name.toUpperCase()}.ENV.CONTAINER_NAME`, name)

  const apiMethod = docker.container[cmd]
  if(apiMethod) return apiMethod({ item: container, force, format })

  const cmdArgs = { ...params }
  
  const first = options[0]
  if(!cmd && first && first.indexOf('=') === -1 && first.indexOf('-') !== 0) cmd = first
  if(!container && options[1]) container = options[1]

  const format = getFormat(params)
  if(format === 'json' || format === 'short') cmdArgs.format = 'json'

  cmdArgs.opts = cmd
    ? container
      ? [ cmd, container ]
      : [ cmd ]
    : [ 'ls -a' ]

  const res = await docker.container(cmdArgs)

  // Log the output of the command
  logContainers(res, cmdArgs)

}

module.exports = {
  container: {
    name: 'container',
    alias: [ 'cont', 'c', 'dc' ],
    action: dockerContainer,
    description: `Runs docker container command`,
    example: 'keg docker container <options>',
    tasks: {
      ...require('./clean'),
      ...require('./commit'),
      ...require('./remove'),
      ...require('./stop'),
    },
    options: {
      cmd: {
        description: 'Docker container command to run. Default ( ls )',
        example: 'keg docker container ls',
      },
      name: {
        description: 'Name of the container to run the command on',
        example: 'keg docker container --name core',
      },
      force: {
        description: 'Add the force argument to the docker command',
        example: 'keg docker container --force',
      },
      json: {
        alias: ['js'],
        description: 'Format docker image output to JSON',
        example: 'keg docker container --json ',
      },
      short: {
        alias: ['sm'],
        default: true,
        description: 'Format docker image output to short output',
        example: 'keg docker container --short',
      },
      format: {
        allowed: [ 'json', 'js', `short`, 'sm' ],
        description: 'Output format of the docker command',
        example: 'keg docker container --format json',
      },
    },
  }
}
