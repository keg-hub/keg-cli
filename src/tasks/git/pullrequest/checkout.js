const { Logger } = require('@keg-hub/cli-utils')
const { spawnCmd } = require('@keg-hub/spawn-cmd')
const { getGitPath } = require('KegUtils/git/getGitPath')
const { isInt, toInt, exists } = require('@keg-hub/jsutils')
const { throwNoConfigPath, generalError } = require('KegUtils/error')


/**
 * Git log task
 * @param {Object} args - arguments passed from the runTask method
 * @param {string} args.command - Initial command being run
 * @param {Array} args.options - arguments passed from the command line
 * @param {Object} args.tasks - All registered tasks of the CLI
 * @param {Object} globalConfig - Global config object for the keg-cli
 *
 * @returns {void}
 */
const checkout = async args => {
  const { params, options, globalConfig } = args
  const { context, number, tap, log } = params

  const prNum = number || options.find(opt => isInt(toInt(opt)))

  !exists(prNum) && generalError(`A pull request number is required!`)

  const location = !tap && ! context
    ? process.cwd()
    : await getGitPath(tap || context)

  !location && throwNoConfigPath(globalConfig, tap || context)

  const cmdStr = `gh pr checkout ${ prNum }`
  log && Logger.pair(`Running command: `, cmdStr)

  await spawnCmd(cmdStr, {cwd: location})
}

module.exports = {
  checkout: {
    name: 'checkout',
    alias: [ 'ch' ],
    action: checkout,
    description: `Checkout a pull request from github!`,
    example: 'keg pr checkout <options>',
    options: {
      context: {
        alias: [ 'name' ],
        description: 'Context or name of the repo to execute the pr command on',
        example: 'keg pr --context core ',
        enforced: true,
      },
      number: {
        alias: [ 'num' ],
        description: `Pull request number.`,
        example: 'keg pr --context core --number 23',
      },
      tap: {
        description: 'Name of the linked tap when context option it set to tap',
        example: 'keg pr --context tap --tap events-force',
        enforced: true,
      },
      log: {
        description: 'Log the compose command to the terminal',
        example: 'keg pr --no-log',
        default: true,
      },
    }
  }
}