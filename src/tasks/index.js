const { isObj, isFunc, reduceObj } = require('@keg-hub/jsutils')
const { buildTaskData } = require('../utils/builders/buildTaskData')

/**
 * Initializes tasks for the CLI. Loads all default and custom tasks
 * @param {Object|Function} name - Name of the task file to load
 * @param {Object} globalConfig - CLI global config object
 *
 * @returns {Object} - All loaded CLI tasks
 */
const initialize = (tasks, name, globalConfig) => {

  const parentTasks = isFunc(tasks) ? tasks(globalConfig) : isObj(tasks) ? tasks : {}

  return reduceObj(parentTasks, (key, value, updates) => {
    const task = parentTasks[key]
    return {
      ...updates,
      ...buildTaskData(task, name),
    }
  }, {})

}

module.exports = globalConfig => {
  return {
    ...initialize(require('./base'), 'base', globalConfig),
    ...initialize(require('./cli'), 'cli', globalConfig),
    ...initialize(require('./config'), 'config', globalConfig),
    ...initialize(require('./core'), 'core', globalConfig),
    ...initialize(require('./docker'), 'docker', globalConfig),
    ...initialize(require('./git'), 'git', globalConfig),
    ...initialize(require('./global'), 'global', globalConfig),
    ...initialize(require('./generate'), 'generate', globalConfig),
    ...initialize(require('./mutagen'), 'mutagen', globalConfig),
    ...initialize(require('./network'), 'network', globalConfig),
    ...initialize(require('./proxy'), 'proxy', globalConfig),
    ...initialize(require('./tap'), 'tap', globalConfig),
  }
}