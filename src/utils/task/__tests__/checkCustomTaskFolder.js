const cliUtils = require('@keg-hub/cli-utils')

let testPath = '/I/am/a/path'
let foundPath = testPath
let existsMock = [null, true]
const throwError = jest.fn()
const pathExists = jest.fn(() => { return existsMock })
const getFolderContent = jest.fn(() => { return foundPath && [foundPath] })

const oldThrowError = cliUtils.error.throwError
const oldPathExists = cliUtils.fileSys.pathExists
const oldGetFolderContent = cliUtils.fileSys.getFolderContent

cliUtils.error.throwError = throwError
cliUtils.fileSys.pathExists = pathExists
cliUtils.fileSys.getFolderContent = getFolderContent

const { checkCustomTaskFolder } = require('../checkCustomTaskFolder')

describe('checkCustomTaskFolder', () => {

  beforeAll(() => {
    cliUtils.error.throwError = throwError
    cliUtils.fileSys.pathExists = pathExists
    cliUtils.fileSys.getFolderContent = getFolderContent
  })
  
  beforeEach(() => {
    throwError.mockClear()
    pathExists.mockClear()
    getFolderContent.mockClear()
  })

  afterAll(() => {
    cliUtils.error.throwError = oldThrowError
    cliUtils.fileSys.pathExists = oldPathExists
    cliUtils.fileSys.getFolderContent = oldGetFolderContent
    jest.resetAllMocks()
  })

  it('should search for the passed in path, then check if it exists', async () => {
    await checkCustomTaskFolder({
      path: testPath
    })
    expect(getFolderContent).toHaveBeenCalled()
    expect(pathExists).toHaveBeenCalled()
  })

  it('should search for the index.js file in the found path', async () => {
    await checkCustomTaskFolder({
      path: testPath
    })
    expect(pathExists.mock.calls[0][0]).toBe(`${testPath}/index.js`)
  })

  it('should return the index file path', async () => {
    const resp =await checkCustomTaskFolder({
      path: testPath
    })
    expect(resp).toBe(`${testPath}/index.js`)
  })

  it('should return undefined if index file does not exist', async () => {
    existsMock = [{ message: 'Does not exist'}]
    const resp = await checkCustomTaskFolder({
      path: testPath
    })
    expect(resp).toBe(undefined)
  })
  
  it('should return false if not found', async () => {
    foundPath = ''
    const resp = await checkCustomTaskFolder({
      path: testPath
    })
    expect(resp).toBe(false)
    foundPath = testPath
  })

})
