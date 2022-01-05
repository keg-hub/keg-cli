const { inspect } = require('./inspect')
const { Logger } = require('@keg-hub/cli-utils')

/**
 * Gets the last Cmd of a built docker image
 * @function
 * @param {Object} args - Arguments to pass to the docker image command
 * @param {string} args.image - Reference to the docker image
 * @param {string} args.envs - ENVs to pass to the child process
 * @param {string} args.clean - Cleans the returned cmd string 
 * 
 * @param {string} args.location - Location where the docker command should be run
 *
 * @returns {string|Array} - Response from docker cli
 */
const getCmd = async ({ clean, ...args }) => {
  const rawCmd = args.image
    ? await inspect({ ...args, parse: false, format: '-f {{.Config.Cmd}}' })
    : Logger.error(`Docker image reference is required to run the image get command method!`) || ''

  const cmd = rawCmd.replace('\n', '')
  if(!clean) return cmd

  const cleaned = cmd[0] === '[' ? cmd.substr(1) : cmd

  // TODO: May need to add `.replace(',', '')` to cleaned.slice(0, -1)
  // This is for cases where the CMD is an array. Need to investigate
  return cleaned[ cleaned.length -1 ] === ']'
    ? cleaned.slice(0, -1)
    : cleaned

}

module.exports = {
  getCmd
}