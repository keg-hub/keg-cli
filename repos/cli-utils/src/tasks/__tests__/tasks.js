jest.resetModules()
jest.resetAllMocks()


const appRoot = `/some/test/path`
const appRootMock = {
  getAppRoot: jest.fn(() => appRoot)
}

jest.setMock('../../appRoot', appRootMock)


const dynamicTask = {
  data: {
    dynamicTaskOne: {
      name: `dynamic task 1`
    }
  }
}

let loadTSFiles = false
const fileSysMock = {
  getFolders: jest.fn(() => [appRoot]),
  requireFile: jest.fn((...args) => {
    const fileName = args[1]
    
    if(loadTSFiles && fileName.endsWith(`.js`))
      return undefined

    return dynamicTask
  })
}

jest.setMock('../../fileSys', fileSysMock)

const testTasks = {
  testTaskOne: {
    name: `test task 1`
  },
  testTaskTwo: {
    name: `test task 2`
  },
  testTaskThree: {
    name: `test task 3`
  },
}

const allTasks = {
  ...testTasks,
  ...dynamicTask.data,
}

const {
  setUseTS,
  registerTasks,
  setTaskFolder,
  getTaskDefinitions,
}  = require('../tasks')

describe('tasks', () => {

  describe('registerTasks', () => {
    
    beforeEach(() => {
      fileSysMock.getFolders.mockClear()
      fileSysMock.requireFile.mockClear()
      appRootMock.getAppRoot.mockClear()
    })
    
    it(`should register new tasks  to the tasks object`, async () => {
      registerTasks(testTasks)
      const defs = await getTaskDefinitions()
      expect(defs).toEqual(allTasks)
    })
    
  })

  describe('setTaskFolder', () => {

    beforeEach(() => {
      fileSysMock.getFolders.mockClear()
      fileSysMock.requireFile.mockClear()
      appRootMock.getAppRoot.mockClear()
    })

    afterEach(() => {
      setTaskFolder(`tasks`)
    })
    
    it(`should set the name of the task folder that will be searched`, async () => {
      setTaskFolder(`customTaskFolder`)
      await getTaskDefinitions(testTasks)
      const opts = fileSysMock.getFolders.mock.calls[0][1]
      expect(opts.include).toEqual(['customTaskFolder'])
    })

  })

  describe('getTaskDefinitions', () => {

    beforeEach(() => {
      fileSysMock.getFolders.mockClear()
      fileSysMock.requireFile.mockClear()
      appRootMock.getAppRoot.mockClear()
      loadTSFiles = false
    })
    
    afterAll(() => {
      loadTSFiles = false
    })
    
    it(`should use the default tasks folder when searching for dynamic tasks`, async () => {
      await getTaskDefinitions(testTasks)
      const opts = fileSysMock.getFolders.mock.calls[0][1]
      expect(opts.include).toEqual(['tasks'])
    })

    it(`should return registered tasks when called`, async () => {
      const defs = await getTaskDefinitions(testTasks)
      expect(defs).toEqual(allTasks)
    })

    it(`should try to load index tasks file`, async () => {
      await getTaskDefinitions(testTasks)
      expect(fileSysMock.requireFile).toHaveBeenCalledTimes(1)
      const args = fileSysMock.requireFile.mock.calls[0]
      expect(args[1]).toBe(`index`)
    })

  })

})