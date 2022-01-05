jest.resetModules()
jest.resetAllMocks()
jest.clearAllMocks()

const { testEnum } = require('../../../__mocks__/testEnum')

const defParams = { test: '1234' }
const parseTaskArgsMock = jest.fn(() => {
  return defParams
})
jest.setMock('../parseTaskArgs', {
  parseTaskArgs: parseTaskArgsMock
})

const showHelpMock = jest.fn()
jest.setMock('../../logger/showHelp', {
  showHelp: showHelpMock
})

const hasHelpArgMock = jest.fn((helpArg) => {
  return helpArg === `--help`
})
jest.setMock('../hasHelpArg', {
  hasHelpArg: hasHelpArgMock
})

const throwNoActionMock = jest.fn()
jest.setMock('../../error', {
  throwNoAction: throwNoActionMock
})

const taskActionMock = jest.fn()
const defTask = {
  name: `testTask`,
  action: taskActionMock,
}

const defArgs = {
  globalConfig: {},
  options: [],
  command: `testTask`,
  task: defTask,
  tasks: {testTask: defTask}
}

const testArgs = {
  TaskAction: [
    {
      description: 'Calls the passed in task.action',
      inputs: [{ 
        ...defArgs
      }],
      outputs: () => {
        expect(taskActionMock).toHaveBeenCalled()
      }
    },
    {
      description: 'Passes the correct args to the task.action',
      inputs: [{ 
        ...defArgs,
        options: [`test=1234`]
      }],
      outputs: () => {
        const args = taskActionMock.mock.calls[0][0]
        expect(args.globalConfig).toBe(defArgs.globalConfig)
        expect(args.options).toEqual([`test=1234`])
        expect(args.command).toBe(defArgs.command)
        expect(args.task.name).toBe(defTask.name)
        expect(args.task.action).toBe(defTask.action)
        expect(args.params).toBe(defParams)
      }
    },
  ],
  HelpCheck: [
    {
      description: 'Calls the hasHelpArg to see if help menu should be shown',
      inputs: [{ 
        ...defArgs
      }],
      outputs: () => {
        expect(hasHelpArgMock).toHaveBeenCalled()
      }
    },
    {
      description: 'Does not call showHelp when help arg is not passed',
      inputs: [{ 
        ...defArgs
      }],
      outputs: () => {
        expect(showHelpMock).not.toHaveBeenCalled()
      }
    },
    {
      description: 'Calls the showHelp when help arg is passed',
      inputs: [{ 
        ...defArgs,
        options: [ `--test`, `--help`]
      }],
      outputs: () => {
        expect(showHelpMock).toHaveBeenCalled()
      }
    },
  ],
  ParseArgs: [
    {
      description: 'Calls parseTaskArgs when params are not pass',
      inputs: [{ 
        ...defArgs
      }],
      outputs: () => {
        expect(parseTaskArgsMock).toHaveBeenCalled()
      }
    },
    {
      description: 'Does not call parseTaskArgs when params are passed',
      inputs: [{ 
        ...defArgs,
        params: { test: `1234` }
      }],
      outputs: () => {
        expect(parseTaskArgsMock).not.toHaveBeenCalled()
      }
    },
  ],
  NoAction: [
    {
      description: 'Does not throwNoAction when task.action is a function',
      inputs: [{ 
        ...defArgs,
      }],
      outputs: () => {
        expect(throwNoActionMock).not.toHaveBeenCalled()
      }
    },
    {
      description: 'Calls throwNoAction when task.action is not a function',
      inputs: [{ 
        ...defArgs,
        task: { ...defTask, action: true }
      }],
      outputs: () => {
        expect(taskActionMock).not.toHaveBeenCalled()
        expect(throwNoActionMock).toHaveBeenCalled()
      }
    },
  ]
}

const { executeTask } = require('../executeTask')

describe('executeTask', () => {
  beforeEach(() => {
    showHelpMock.mockClear()
    taskActionMock.mockClear()
    hasHelpArgMock.mockClear()
    throwNoActionMock.mockClear()
    parseTaskArgsMock.mockClear()
  })

  afterAll(() => jest.resetAllMocks())

  testEnum(testArgs, executeTask)
})