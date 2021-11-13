const error = require('./error')
const fileSys = require('./fileSys')
const { Logger } = require('./logger')
const constants = require('./constants')
const { runTask } = require('./runTask')
const { registerTasks } = require('./tasks/tasks')
const { getAppRoot, setAppRoot } = require('./appRoot')

const {
  getKegGlobalConfig,
  findTask,
  sharedOptions,
  setSharedOptions,
} = require('./task')

module.exports = {
  ...require('./process'),
  ...require('./commands'),
  ...require('./network'),
  ...require('./tap'),
  ...require('./path'),
  constants,
  getKegGlobalConfig,
  findTask,
  fileSys,
  error,
  Logger,
  registerTasks,
  runTask,
  sharedOptions,
  setSharedOptions,
  getAppRoot,
  setAppRoot,
}
