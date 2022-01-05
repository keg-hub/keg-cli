const { yml } = require('@keg-hub/parse-config')
const { getContainerConst } = require('../docker/getContainerConst')
const { get, deepMerge, isStr, styleCase, checkCall } = require('@keg-hub/jsutils')

/**
 * Maps keys from the mutagen yml config to work with the mutagen cli
 * The cli keys are not a 1:1 with the yml config keys
 * @object
 */
 const mutagenMap = { mode: 'syncMode' }

/**
 * Parses the passed in options and converts them into an object format mutagen lib can handle
 * @param {String} options - Stringified version of mutagen sync options
 *
 * @returns {Object} - Parsed mutagen options object
 */
const parseOptions = options => {
  if(!options || !isStr(options)) return {}
  
  return options.split(' ')
    .reduce((parsed, option) => {
      option.indexOf(`--ignore=`) === 0
        ? checkCall(() => {
            const ignorePath = option.split('ignore=').pop()
            ignorePath.length && parsed.ignore.paths.push(ignorePath)

          })
        : checkCall(() => {
            let [ key, value ] = option.split('=')
            key = key.indexOf('--') === 0 && key.substring(2) || key
            key && value && (parsed[styleCase(key)] = value)
          })

      return parsed
    }, { ignore: { paths: [] }})

}

/**
 * Loads the mutagen config for the passed in content
 * @param {Object} context - Parent folder name of the mutagen config file
 *
 * @returns {Object} - Loaded mutagen config file
 */
const getMutagenConfig = async params => {
  const { context, options, configPath, __injected, overrides={} } = params

  try {

    const mutagenPath = __injected &&
      __injected.mutagenPath ||
      getContainerConst(context, `ENV.KEG_MUTAGEN_FILE`)

    if(!mutagenPath) return deepMerge(overrides, parseOptions(options))

    const ymlConfig = await yml.load({ location: mutagenPath })

    if(!configPath) return ymlConfig

    const config = get(ymlConfig, configPath, {})

    const mappedConf = Object.keys(config)
      .reduce((conf, key) => {
        conf[ mutagenMap[key] || key ] = config[ key ]
        return conf
      }, {})

    return deepMerge(mappedConf, overrides, parseOptions(options))

  }
  catch(err){
    return overrides
  }

}


module.exports = {
  getMutagenConfig,
}