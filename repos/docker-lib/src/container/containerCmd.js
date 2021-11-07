const { dockerCli } = require('../cmds/dockerCli')
const { noItemError } = require('../utils/error/noItemError')
const { isArr, isStr, noOpObj, noPropArr } = require('@keg-hub/jsutils')

// Container commands the require an item argument of the container id or name
const containerItemCmds = [
  'kill',
  'logs',
  'pause',
  'prune',
  'restart',
  'stop',
  'top',
  'unpause',
  'update'
]

/**
 * Helper to ensure the item exists, and calls dockerRunCmds
 * @function
 * @param {Object} args - Arguments used to modify the docker api call
 * @param {string} args.opts - Options used to build the docker command
 * @param {string} args.format - Format of the docker command output
 * @param {string} cmd - Name of the command to run
 *
 * @returns {*} - Response from the docker command
 */
 const runCmdForItem = async (args, cmd) => {
  if(!args.item) return noItemError(`docker.container.${ cmd }`, true)

  return await containerCmd(args, [ cmd, args.item ])
}

/**
 * Creates container item commands based on containerItemCmds list
 * @object
 */
const containerCmds = containerItemCmds.reduce((commands, command) => {
  commands[command] = args => runCmdForItem(args, command)
  return commands
}, {})


/**
 * Helper to format the docker command call and options
 * Then calls the dockerCli
 * @function
 * @param {Object} args - Arguments used to modify the docker api call
 * @param {string} args.opts - Options used to build the docker command
 * @param {string} args.format - Format of the docker command output
 *
 * @returns {*} - Response from the docker command call
 */
const containerCmd = (args=noOpObj, opts) => {
  opts = opts || args.opts
  return dockerCli({
    ...args,
    opts: [ 'container' ].concat(
      isArr(opts)
        ? opts
        : isStr(opts)
          ? opts.split(' ')
          : noPropArr
    )
  })
}

module.exports = {
  containerCmd,
  containerCmds
}