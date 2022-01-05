const { throwExitError } = require('../error')
const { noOpArr, isArr, isObj } = require('@keg-hub/jsutils')

/**
 * Maps task alias to a task name, relative to the options
 * @function
 * @private
 * @param {Object} tasks - Task Definitions
 * @param {string} task - Name of the task to search for an alias
 *
 * @example
 * getTaskRef(tasks, taskName)
 *
 * @returns {Object} - Found task object
 */
const getTaskRef = (tasks, task) => {
  return Object.values(tasks)
    .find(definition => (
      definition.name === task || (isArr(definition.alias) && definition.alias.includes(task))
    ))
}

/**
 * Loops over the options looking for a matching name to the passed in task
 * @function
 * @private
 * @param {Object} task - Custom Task Definition
 * @param {Array} options - Task options that can be shared across tasks
 *
 * @example
 * findTask({...task definition}, [...options])
 *
 * @returns {Object} - Found task definition by name
 */
const findTaskFromOptions = (task, options) => {
  const opt = options.shift()
  const subTasks = isObj(task) && task.tasks
  const subTask = opt && subTasks && getTaskRef(subTasks, opt)

  return !subTask
    ? { task: task, options: opt ? [ opt, ...options ] : options }
    : findTaskFromOptions(subTask, options)
}

/**
 * Finds the correct task definition relative to the options
 * @function
 * @export
 * @param {Object} tasks - Custom Task Definitions
 * @param {Array} options - Task options that can be shared across tasks
 * @param {Boolean} [throwError=true] - If true, will throw when a task can not be found
 * throwError
 *
 * @example
 * findTask({...task definitions}, [...options])
 *
 * @returns {void}
 */
const findTask = (tasks, opts = noOpArr, throwError=true) => {
  const options = [...opts]
  const taskName = options.shift()
  const task = getTaskRef(tasks, taskName)
  const foundTask = task && findTaskFromOptions(task, options)

  return foundTask && foundTask.task
    ? {...foundTask, tasks}
    : throwExitError(new Error(`Task not found for argument: ${taskName}`))

}

module.exports = {
  findTask,
  getTask: findTask, 
}
