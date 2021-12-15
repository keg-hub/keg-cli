const error = require('./error')
const fileSys = require('./fileSys')
const constants = require('./constants')
const { runTask } = require('./runTask')
const { registerTasks } = require('./tasks/tasks')
const { getAppRoot, setAppRoot } = require('./appRoot')

const {
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
  ...require('./globalConfig'),
  constants,
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
