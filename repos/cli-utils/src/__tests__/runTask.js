jest.resetAllMocks()
jest.clearAllMocks()

const testKegConfig = {}
const testTask = {
  task: {
    name: 'test',
    options: {},
    action: jest.fn()
  },
  options: [
    'test:test',
    '--other option'
  ]
}

let helpArg = false
const hasHelpArgMock = jest.fn(() => helpArg)
const orgArgv = process.argv
const findTaskMock = jest.fn(() => (testTask))
const showHelpMock = jest.fn()
const getTaskDefinitionsMock = jest.fn(() => {})
const argsParseMock = jest.fn(() => ({ test: 'test', other: 'option' }))
const getKegGlobalConfigMock = jest.fn(() => (testKegConfig))

jest.setMock('../task/findTask', { findTask: findTaskMock })
jest.setMock('../task/hasHelpArg', { hasHelpArg: hasHelpArgMock })
jest.setMock('../logger/showHelp', { showHelp: showHelpMock })
jest.setMock('@keg-hub/args-parse', { argsParse: argsParseMock })
jest.setMock('../tasks', { getTaskDefinitions: getTaskDefinitionsMock })
jest.setMock('../globalConfig/getKegGlobalConfig', { getKegGlobalConfig: getKegGlobalConfigMock })

const { runTask } = require('../runTask')

describe('RunTask', () => {

  beforeEach(() => {
    showHelpMock.mockClear()
    findTaskMock.mockClear()
    argsParseMock.mockClear()
    hasHelpArgMock.mockClear()
    testTask.task.action.mockClear()
    getTaskDefinitionsMock.mockClear()
    helpArg = false
    process.argv = [ '1', '2', 'test']
  })

  afterAll(() => {
    process.argv = orgArgv
  })
  
  test('Should export a runTask method', () => {
    expect(typeof runTask).toBe('function')
  })

  test('Should not automatically call runTask when imported ', () => {
    // runTask calls getKegGlobalConfig method, so we mock it and check if it was called
    // If it was not, then runTask was not called
    expect(getKegGlobalConfigMock).not.toHaveBeenCalled()
    const { runTask } = require('../runTask')
    expect(getKegGlobalConfigMock).not.toHaveBeenCalled()
  })

  test('Should try to load the keg global config', async () => {
    await runTask()
    expect(getKegGlobalConfigMock).toHaveBeenCalled()
  })

  test('Should try to find the correct task', async () => {
    expect(findTaskMock).not.toHaveBeenCalled()
    await runTask()
    expect(findTaskMock).toHaveBeenCalled()
  })

  test('Should try to parse the passed in options into params', async () => {
    expect(argsParseMock).not.toHaveBeenCalled()
    await runTask()
    expect(argsParseMock).toHaveBeenCalled()
  })

  test('Should call the tasks action', async () => {
    expect(testTask.task.action).not.toHaveBeenCalled()
    await runTask()
    expect(testTask.task.action).toHaveBeenCalled()
  })

  test('Should call show help when no args are passed', async () => {
    expect(showHelpMock).not.toHaveBeenCalled()
    process.argv = []
    await runTask()
    expect(showHelpMock).toHaveBeenCalled()
  })

  test('Should call show help when help arg is passed', async () => {
    expect(showHelpMock).not.toHaveBeenCalled()
    helpArg = true
    process.argv = ['1','2', '--help']
    await runTask()
    expect(showHelpMock).toHaveBeenCalled()
  })
  
})