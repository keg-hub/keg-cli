const docker = require('KegDocCli')
const { Logger } = require('@keg-hub/cli-utils')
const { get, checkCall } = require('@keg-hub/jsutils')

/**
 * Execute a docker command to test that it's working
 * @function
 * @param {Object} args - arguments passed from the runTask method
 * @param {string} args.command - Initial command being run
 * @param {Array} args.options - arguments passed from the command line
 *
 * @returns {void}
 */
const dockerTest = async args => {
  const { params } = args
  const { method, options } = params
  const opts = options && options.split(',')

  const res = await checkCall(get(docker, method), ...opts)
  res && Logger.print(res)

}

module.exports = {
  test: {
    name: 'test',
    action: dockerTest,
    description: 'Tests a docker-lib command by running it',
    example: 'keg docker test <cmd> <options>',
    options: {
      method: {
        description: 'Docker method to run. Use dot notation to access sub methods of the docker lib',
        example: `keg docker test --method container.port`,
        default: 'container.list'
      },
      options: {
        alias: [ 'opts' ],
        description: 'Comma separated list of arguments to pass to the method',
        example: `keg docker test --method container.port --options core,19006`,
      },
      format: {
        description: 'Format of the docker cli output',
        example: `keg docker test --method container.port --format text`,
        default: 'json'
      },
    }
  }
}