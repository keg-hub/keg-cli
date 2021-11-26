const cliUtils = require('@keg-hub/cli-utils')

const generalError = jest.fn()
jest.setMock('../../error/generalError', { generalError })

let existsMock = []
const pathExists = jest.fn(() => { return existsMock })
const oldPathExists = cliUtils.fileSys.pathExists
cliUtils.fileSys.pathExists = pathExists

const { checkPathExists } = require('../checkPathExists')

describe('checkPathExists', () => {

  beforeAll(() => {
    cliUtils.fileSys.pathExists = pathExists
  })
  
  afterAll(() => {
    cliUtils.fileSys.pathExists = oldPathExists
    jest.resetAllMocks()
  })

  it('should call pathExists from the filesys lib', async () => {
    await checkPathExists('I/am/a/path')

    expect(pathExists).toHaveBeenCalled()
  })

  it('should throw an error if path dose not exist', async () => {
    const { checkPathExists } = require('../checkPathExists')
    existsMock = [ { message: 'I am error'}, false ]
    await checkPathExists('I/am/a/path')

    expect(generalError).toHaveBeenCalledWith('I am error')
  })

})