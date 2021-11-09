jest.resetAllMocks()
jest.clearAllMocks()

const path = require('path')
const homeDir = require('os').homedir()
const { getKegGlobalConfig } = require('@keg-hub/cli-utils')

const {
  removeYmlFile,
  writeYmlFile,
} = require('../../__mocks__')

const mocksDir = path.join(__dirname, '../../__mocks__')

const testYmlFile = path.join(homeDir, `./.kegConfig/parse.yml`)
const testYmlData = {
  env: {
    item: '{{test.data}}',
    array: [1, 2],
    Object: { '{{name}}': '{{version}}' },
    defaultEnv: '{{ cli.settings.defaultEnv }}',
  }
}

const { loadConfigs } = require('../loadConfigs')

describe('Loaders.loadConfigs', () => {
  
  beforeEach(async () => {
    await writeYmlFile(testYmlFile, testYmlData)
  })

  afterEach(async () => {
    await removeYmlFile(testYmlData)
  })

  afterAll(() => jest.resetAllMocks())

  it(`should load default values from the default paths`, () => {
    const loaded = loadConfigs({ name: 'parse' })

    Object.keys(testYmlData.env).map(key => {
      expect(loaded[key]).not.toBe(undefined)
      expect(typeof loaded[key]).toBe(typeof testYmlData.env[key])
    })
  })

  it(`should the template values should be filled`, () => {
    const loaded = loadConfigs({ name: 'parse' })

    const globalConfig = getKegGlobalConfig()
    expect(loaded.defaultEnv).toBe(globalConfig.cli.settings.defaultEnv)
    expect(loaded.Object).toEqual({ [globalConfig.name]: globalConfig.version })
  })

  it(`should load a config from a custom locations for yml files`, () => {
    const loaded = loadConfigs({ name: 'parse', locations: [ mocksDir ]})
    expect(loaded.CUSTOM_CONFIG_LOCATION).toBe('path/to/custom/config')
  })

  it(`should load a config from a custom locations for env files`, () => {
    const loaded = loadConfigs({ name: 'parse', locations: [ mocksDir ]})
    expect(loaded.CUSTOM_ENV_TEST_LOCATION).toBe('/custom/env/test/location')
  })

})
