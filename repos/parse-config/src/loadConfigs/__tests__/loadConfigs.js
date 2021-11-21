jest.resetAllMocks()
jest.clearAllMocks()

const path = require('path')
const homeDir = require('os').homedir()

const yml = require('../../yml/yml')
const env = require('../../env/env')

const loadYmlSyncMock = jest.fn((...args) => yml.loadYmlSync(...args))
jest.setMock('../../yml/yml', {
  ...yml,
  loadYmlSync: loadYmlSyncMock
})
const loadEnvSyncMock = jest.fn((...args) => env.loadEnvSync(...args))
jest.setMock('../../env/env', {
  ...env,
  loadEnvSync: loadEnvSyncMock
})

const {
  writeYmlFile,
  removeYmlFile,
  ymlSearchPaths,
  envSearchPaths,
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
    loadYmlSyncMock.mockClear()
    loadEnvSyncMock.mockClear()
  })

  afterAll(() => jest.resetAllMocks())

  it(`should load a config from a custom locations for yml files`, () => {
    const loaded = loadConfigs({ name: 'parse', locations: [ mocksDir ]})
    expect(loaded.CUSTOM_CONFIG_LOCATION).toBe('path/to/custom/config')
  })

  it(`should load a config from a custom locations for env files`, () => {
    const loaded = loadConfigs({ name: 'parse', locations: [ mocksDir ]})
    expect(loaded.CUSTOM_ENV_TEST_LOCATION).toBe('/custom/env/test/location')
  })

  it(`should call the load sync method for the correct config type`, () => {
    loadConfigs({ noEnv: true, name: 'parse' })
    expect(loadYmlSyncMock).toHaveBeenCalled()
    expect(loadEnvSyncMock).not.toHaveBeenCalled()

    loadYmlSyncMock.mockClear()
    loadEnvSyncMock.mockClear()

    loadConfigs({ noYml: true, name: 'parse' })
    expect(loadEnvSyncMock).toHaveBeenCalled()
    expect(loadYmlSyncMock).not.toHaveBeenCalled()

  })

  it(`should call the load sync method with the correct paths`, () => {
    loadConfigs({ noEnv: true, name: 'parse' })

    loadYmlSyncMock.mock.calls.map(mockCall => {
      const args = mockCall[0]
      const ymlLoc = args.location
      const cleanedLoc = ymlLoc.includes(`keg-cli/repos/`)
        ? ymlLoc.split(`keg-cli/repos/`).pop()
        : ymlLoc.split('/').slice(3).join('/')

      expect(ymlSearchPaths.includes(cleanedLoc)).toBe(true)
    })
  })

  it(`should call the load sync method with the correct paths`, () => {
    loadConfigs({ noYml: true, name: 'parse' })

    loadEnvSyncMock.mock.calls.map(mockCall => {
      const args = mockCall[0]
      const envLoc = args.location
      const cleanedLoc = envLoc.includes(`keg-cli/repos/`)
        ? envLoc.split(`keg-cli/repos/`).pop()
        : envLoc.split('/').slice(3).join('/')

      expect(envSearchPaths.includes(cleanedLoc)).toBe(true)
    })
  })
  
})
