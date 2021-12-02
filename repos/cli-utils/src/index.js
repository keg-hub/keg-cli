const error = require('./error')
const fileSys = require('./fileSys')
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
  ...require('./commands'),
  ...require('./logger'),
  ...require('./network'),
  ...require('./path'),
  ...require('./process'),
  ...require('./tap'),
  constants,
  getKegGlobalConfig,
  findTask,
  fileSys,
  error,
  registerTasks,
  runTask,
  sharedOptions,
  setSharedOptions,
  getAppRoot,
  setAppRoot,
}
