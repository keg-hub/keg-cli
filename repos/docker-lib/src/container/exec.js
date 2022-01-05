const { raw } = require('../cmds/raw')
const { pickKeys, isArr } = require('@keg-hub/jsutils')
const { noItemError } = require('../utils/error/noItemError')
const { toContainerEnvs } = require('../utils/containerEnvs')

/**
 * Connects to a running container, and runs a command
 * @function
 * @example
 * docker exec -it app /bin/bash
 * @param {string} args - Arguments used to connect to the container
 *
 * @returns {void}
 */
const exec = async (args, cmdOpts={}) => {
  const {
    cmd,
    opts,
    detach,
    workdir,
    location,
    container
  } = pickKeys(args, [
    'cmd',
    'opts',
    'detach',
    'workdir',
    'location',
    'container'
  ])
  
  !container && noItemError('exec')

  const { options:cmdOptions } = cmdOpts
  const execEnvs = (cmdOptions && cmdOptions.env && toContainerEnvs(cmdOptions.env)) || ''

  // Ensure options is an array
  const options = isArr(opts) ? opts : [ opts ]

  // Add any extra options passed
  detach && options.push(`--detach`)
  workdir && options.push(`--workdir`, workdir)

  const execOpts = `${ execEnvs } ${ options.join(' ').trim() }`.trim()
  const toRun = `exec ${ execOpts } ${ container } ${ cmd }`.trim()

  return raw(toRun, cmdOpts, location)

}

module.exports = {
  exec
}
