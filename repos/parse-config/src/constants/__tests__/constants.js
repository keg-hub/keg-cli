jest.resetAllMocks()
jest.clearAllMocks()

const path = require('path')
const homeDir = require('os').homedir()


describe(`constants`, () => {
  beforeEach(async () => {
    
  })

  afterEach(async () => {
    process.env.KEG_GLOBAL_CONFIG = undefined
    jest.resetModules()
    delete require.cache['../constants']
  })

  afterAll(() => jest.resetAllMocks())

  it(`should load the default constants`, () => {
    const constants = require('../constants')
    expect(constants.GLOBAL_CONFIG_FOLDER.includes('/.kegConfig')).toBe(true)
    expect(constants.GLOBAL_CONFIG_FILE).toBe('cli.config.json')
  })

  it(`should allow overriding with KEG_GLOBAL_CONFIG env`, () => {
    process.env.KEG_GLOBAL_CONFIG = `/test/custom/path/config.json`
    const constants = require('../constants')
    expect(constants.GLOBAL_CONFIG_FOLDER.includes('/test/custom/path')).toBe(true)
    expect(constants.GLOBAL_CONFIG_FILE).toBe('config.json')
  })

  it(`should allow overriding with KEG_CONFIG_FILE and KEG_GLOBAL_CONFIG envs`, () => {
    process.env.KEG_CONFIG_FOLDER = `/test/separate/path/`
    process.env.KEG_CONFIG_FILE = `separate-config.json`
    const constants = require('../constants')
    
    expect(constants.GLOBAL_CONFIG_FOLDER.includes('/test/separate/path/')).toBe(true)
    expect(constants.GLOBAL_CONFIG_FILE).toBe('separate-config.json')
  })

})
