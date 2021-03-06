const { getTapPath, getTapConfig, getTapPackage } = require('@keg-hub/cli-utils')
const { generalError } = require('KegUtils/error')

/**
 * Prints out a tap's root, config, or package.json file path.
 * @param {Object} args - arguments passed from the runTask method
 */
const printPath = args => {
  const { params } = args
  const { tap, config, package } = params

  !tap && generalError('Cannot print config without a tap parameter.')

  const tapPath = getTapPath(args.globalConfig, tap)
  const [ , configPath ] = getTapConfig({ name: tap })
  const [ , packagePath ] = getTapPackage({ name: tap })
  
  if (package) return console.log(packagePath)
  else if (config) console.log(configPath)
  else return console.log(tapPath)
}

module.exports = {
  path: {
    name: 'path',
    action: printPath,
    description: `Prints out the tap's path`,
    alias: ['prnt', 'prn'],
    options: {
      tap: {
        description: 'The alias of the tap. Use this parameter or set it with the root task name.',
        example: 'keg tap path --tap evf ; OR keg evf path',
        alias: ['t'],
      },
      root: {
        description: 'Prints out just the path to the tap\'s root directory',
        example: 'keg evf path --root',
        alias: ['cfg', 'c'],
        default: false
      },
      config: {
        description: 'Prints out just the path to the tap\'s config',
        example: 'keg evf path --config',
        alias: ['cfg', 'c'],
        default: false
      },
      package: {
        description: 'Prints out the path to the tap\'s package.json',
        example: 'keg evf path --package',
        alias: ['pkg', 'p'],
        default: false
      }
    }
  }
}
