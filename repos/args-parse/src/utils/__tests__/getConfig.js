const path = require('path')

const joinMock = jest.fn((...toJoin) => path.join(...toJoin)) 
jest.setMock('path', { ...path, join: joinMock })

const { getConfig, clearConfig } = require('../getConfig')

describe.only('getConfig', () => {

  afterAll(() => jest.resetAllMocks())

  beforeEach(() => {
    clearConfig()
    jest.resetModules()
    process.env.PARSE_CONFIG_PATH = undefined
    delete process.env.PARSE_CONFIG_PATH
    process.env.KEG_TASKS_CONFIG = undefined
    delete process.env.KEG_TASKS_CONFIG
  })

  it('should load the config', () => {

    const config = getConfig()

    expect(typeof config).toBe('object')
    expect(typeof config.bools).toBe('object')
    expect(typeof config.environment).toBe('object')
    expect(config.test).toBe(undefined)

  })

  it('should cache the loaded config', () => {

    const config = getConfig()
    
    expect(joinMock).toHaveBeenCalled()
    expect(typeof config).toBe('object')
    
    joinMock.mockClear()

    const config2 = getConfig()

    expect(joinMock).not.toHaveBeenCalled()
    expect(typeof config2).toBe('object')
    expect(config2).toBe(config)

  })

  it('should load and merge the config from a ENV PARSE_CONFIG_PATH when set', () => {

    process.env.PARSE_CONFIG_PATH = 'src/__mocks__/testConfig'
    const config = getConfig()
    expect(typeof config).toBe('object')
    expect(typeof config.test).toBe('object')
    expect(typeof config.environment).toBe('object')

  })

  it('should work with alternate ENV KEG_TASKS_CONFIG', () => {

    expect(process.env.PARSE_CONFIG_PATH).toBe(undefined)
    process.env.KEG_TASKS_CONFIG = 'src/__mocks__/testConfig'
    const config = getConfig()

    expect(typeof config).toBe('object')
    expect(typeof config.test).toBe('object')
    expect(typeof config.environment).toBe('object')

  })

  it('should load the config from passed in argument', () => {

    expect(process.env.PARSE_CONFIG_PATH).toBe(undefined)
    const config = getConfig({ test: { option: 'foo-bar' } })

    expect(typeof config).toBe('object')
    expect(typeof config.test).toBe('object')
    expect(typeof config.environment).toBe('object')
    expect(config.test.option).toBe('foo-bar')

  })

})
