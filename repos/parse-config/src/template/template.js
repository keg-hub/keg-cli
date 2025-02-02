const path = require('path')
const { throwError } = require('../error')
const { promises:fs, readFileSync } = require('fs')
const { limbo, deepMerge, template, noOpObj } = require('@keg-hub/jsutils')
const { GLOBAL_CONFIG_FOLDER, GLOBAL_CONFIG_FILE } = require('../constants/constants')


/**
 * Attempts to load the Keg-CLI global config from the user home directory
 * @function
 * @param {boolean} [throwError=true] - Should the method throw if the config can not be loaded
 *
 * @return {Object} - Loaded Keg-CLI global config
 */
const getGlobalConfig = (throwError = true) => {
  const configPath = path.join(GLOBAL_CONFIG_FOLDER, GLOBAL_CONFIG_FILE)
  try {
    return require(configPath)
  }
  catch (err) {
    if (throwError)
      throw new Error(
        `Keg CLI global config could not be loaded from path: ${configPath}!`
      )

    return {}
  }
}


/**
 * Default template replace pattern
 * @type {RegEx}
 */
let defPattern = /{{([^}]*)}}/g

/**
 * Overrides the default template replace pattern
 * @function
 * @param {RegEx} pattern - Pattern for matching items to be replaced
 *
 * @returns {void}
 */
const setDefaultPattern = pattern => {
  defPattern = pattern || defPattern
}

/**
 * Override the default replace pattern
 * @function
 * @private
 * @param {RegEx} pattern - Template pattern to override the default
 *
 * @returns {void}
 */
const setTemplateRegex = pattern => {
  template.regex = pattern || defPattern
}

/**
 * Merges multiple data sources to use as fill values when filling a template
 * Sources include Keg-CLI global config, process.env, custom data object argument
 * @function
 * @param {Object} data - Custom data with values for filling templates
 * @param {Boolean} expectGlobalConfig - if true, throws if global keg config is not found
 *
 * @returns {Object} - Merge data object
 */
const buildFillData = (data = noOpObj, expectGlobalConfig = false) => {
  const globalConfig = getGlobalConfig(expectGlobalConfig) || noOpObj
  // Add the globalConfig, and the process.envs as the data objects
  // This allows values in ENV templates from globalConfig || process.env
  return {
    ...deepMerge(globalConfig, data),
    envs: deepMerge(globalConfig.envs, process.env, data.envs, data.ENVS),
  }
}

/**
 * Sets the correct template pattern, then fills the template, then resets the template pattern
 * @function
 *
 * @param {string} tmp - Template to be filled
 * @param {Object} data - Data used to fill the template
 * @param {RegEx} pattern - Template pattern to override the default
 * @param {Boolean} expectGlobalConfig - if true, throws if global keg config is not found
 *
 * @returns {string} - Template with the content filled from the passed in data
 */
const execTemplate = (tmp, data, pattern, expectGlobalConfig = false) => {
  // Set the template regex to ensure it uses the passed in pattern or default
  setTemplateRegex(pattern)

  // Fill the template with the data object
  const filled = template(tmp, buildFillData(data, expectGlobalConfig))

  // Reset the template regex pattern after the template is filled
  setTemplateRegex()

  return filled
}

/**
 * Loads and fills a template from the passed in data
 * @param {Object} args - Arguments to load an fill the template
 *
 * @param {string} args.location - Location of the template file on the host machine
 * @param {string} args.template - Template to be filled
 * @param {Object} args.data - Data used to fill the template
 *
 * @returns {string} - Template with the content filled from the passed in data
 */
const fillTemplate = async ({
  location,
  template: tmp,
  data = noOpObj,
  pattern,
}) => {
  const [ err, toFill ] = tmp ? [ null, tmp ] : await limbo(fs.readFile(location, 'utf-8'))

  return err ? throwError(err) : execTemplate(toFill, data, pattern)
}

/**
 * Reads the passed in location or template, and replaces content with values from the dat object
 * @function
 * @param {string} args.location - Location of the template file on the host machine
 * @param {string} args.template - Template to be filled
 * @param {Object} args.data - Data used to fill the template
 *
 * @returns {string} - Template with the content filled from the passed in data
 */
const fillTemplateSync = ({ location, template: tmp, data = {}, pattern }) => {
  return execTemplate(tmp || readFileSync(location, 'utf-8'), data, pattern)
}

module.exports = {
  execTemplate,
  fillTemplate,
  fillTemplateSync,
  setDefaultPattern,
  template: {
    exec: execTemplate,
    fill: fillTemplate,
    fillSync: fillTemplateSync,
    setDefaultPattern,
  },
}
