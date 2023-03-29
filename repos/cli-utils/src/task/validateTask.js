/** @module Task */

const { isObj, isFunc } = require('@keg-hub/jsutils')
const { throwNoAction, throwNoTask } = require('../error')

/**
 * Validates a task to ensure it can be run
 * @function
 * @param {Object} task - Task object to validate that an action exists
 * @param {string} taskPath - Path where the passed in task argument exists
 * @param {boolean} helpArg - Was the help arg passed
 *
 * @returns {Object} - Task if it's valid
 */
const validateTask = (task, taskPath, helpArg) => {
  // Check the task is an object
  return !isObj(task)
    ? throwNoTask(taskPath ? taskPath.replace(/\./g, ' ') : task)
    // Check the action for the found task exists
    : !isFunc(task.action) && !helpArg
      ? throwNoAction(task)
      : task
}

module.exports = {
  validateTask
}
