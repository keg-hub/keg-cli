const error = require('./error')
const fileSys = require('./fileSys')
const constants = require('./constants')
const { runTask } = require('./runTask')
const { registerTasks } = require('./tasks/tasks')
const { getAppRoot, setAppRoot } = require('./appRoot')

const {
  executeTask,
  findTask,
  hasHelpArg,
  parseTaskArgs,
  sharedOptions,
  runInternalTask,
  setSharedOptions,
  validateTask,
} = require('./task')

module.exports = {
  ...require('./commands'),
  ...require('./logger'),
  ...require('./network'),
  ...require('./path'),
  ...require('./process'),
  ...require('./tap'),
  ...require('./globalConfig'),
  constants,
  executeTask,
  findTask,
  fileSys,
  error,
  hasHelpArg,
  registerTasks,
  runTask,
  parseTaskArgs,
  sharedOptions,
  setSharedOptions,
  getAppRoot,
  setAppRoot,
  runInternalTask,
  validateTask,
}
