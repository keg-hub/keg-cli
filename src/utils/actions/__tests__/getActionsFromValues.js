jest.resetModules()

const { testEnum } = require('KegMocks/jest/testEnum')
const { docker } = require('KegMocks/libs/docker')
jest.setMock('@keg-hub/docker-lib', docker)

const getKegContextMock = jest.fn(containerName => containerName)
jest.setMock('KegUtils/getters/getKegContext', { getKegContext: getKegContextMock })

const getKegSettingMock = jest.fn(() => ('default-env'))
jest.setMock('@keg-hub/cli-utils', {
  getKegSetting: getKegSettingMock,
  getDefaultEnv: getKegSettingMock,
})

const loadConfigFilesMock = jest.fn()
jest.setMock('KegConst/docker/loaders', { loadConfigFiles: loadConfigFilesMock })

const testArgs = {
  callLoadValuesFiles: {
    description: 'Calls the loadConfigFiles method',
    inputs: [{ env: 'test-env', containerRef: 'test-ref' }],
    outputs: () => expect(loadConfigFilesMock).toHaveBeenCalled()
  },
  setsLoadPathToBeActions: {
    description: 'Passes the loadPath param as "actions"',
    inputs: [{ env: 'test-env', containerRef: 'test-ref' }],
    outputs: () => {
      expect(loadConfigFilesMock).toHaveBeenCalled()
      outputs: () => (
        expect(loadConfigFilesMock.mock.calls[0][0].loadPath).toEqual('actions')
      )
    }
  },
  doesNotCallGetSetting: {
    description: 'Does not call the getKegSetting method when env is passed',
    inputs: [{ env: 'test-env', containerRef: 'test-ref' }],
    outputs: () => expect(getKegSettingMock).not.toHaveBeenCalled()
  },
  callGetSettingWhenNoEnv: {
    description: 'Calls the getKegSetting when no env is passed',
    inputs: [{ containerRef: 'test-ref' }],
    outputs: () => expect(getKegSettingMock).toHaveBeenCalled(),
  },
  defaultEnvWhenNoEnvPassed: {
    description: 'Uses the default env when no env is passed',
    inputs: [{ containerRef: 'test-ref' }],
    outputs: () => expect(loadConfigFilesMock.mock.calls[0][0].env).toEqual('default-env')
  },
  usesPassedInEnvOverDefault: {
    description: 'Uses the passed in env over the default env',
    inputs: [{ env: 'test-env', containerRef: 'test-ref' }],
    outputs: () => expect(loadConfigFilesMock.mock.calls[0][0].env).toEqual('test-env')
  },
  passesInternalAndInjected: {
    description: 'Merges and passed the __internal and __injected objects',
    inputs: [{ 
      containerRef: 'test-ref',
      env: 'test-env',
      __internal: { internal: true },
      __injected: { injected: true } 
    }],
    outputs: () => {
      expect(loadConfigFilesMock.mock.calls[0][0].__internal.internal).toBe(true)
      expect(loadConfigFilesMock.mock.calls[0][0].__internal.injected).toBe(true)
    }
  },
  injectedOverridesInternal: {
    description: 'Keys in the __injected object override the __internal object',
    inputs: [{ 
      containerRef: 'test-ref',
      env: 'test-env',
      __internal: { internal: true },
      __injected: { internal: false } 
    }],
    outputs: () => {
      expect(loadConfigFilesMock.mock.calls[0][0].__internal.internal).toBe(false)
    }
  },
  usesContainerWhenNoContainerRef: {
    description: 'Uses the container property when no containerRef property exists',
    inputs: [{ 
      container: 'test-container',
      env: 'test-env',
    }],
    outputs: () => {
      expect(loadConfigFilesMock.mock.calls[0][0].name).toBe('test-container')
    }
  },
  containerRefOverridesContainer: {
    description: 'The containerRef property overrides the container property',
    inputs: [{ 
      containerRef: 'overrides-container',
      container: 'test-container',
      env: 'test-env', 
    }],
    outputs: () => {
      expect(loadConfigFilesMock.mock.calls[0][0].name).toBe('overrides-container')
    }
  },
  contextOverridesContainerRef: {
    description: 'The context property overrides the containerRef property',
    inputs: [{ 
      context: 'overrides-container',
      containerRef: 'test-container',
      env: 'test-env', 
    }],
    outputs: () => {
      expect(loadConfigFilesMock.mock.calls[0][0].name).toBe('overrides-container')
    }
  },
  cmdContextOverridesContext: {
    description: 'The cmdContext property overrides the context property',
    inputs: [{ 
      cmdContext: 'overrides-container',
      context: 'test-container',
      env: 'test-env', 
    }],
    outputs: () => {
      expect(loadConfigFilesMock.mock.calls[0][0].name).toBe('overrides-container')
    }
  },
}

const { getActionsFromValues } = require('../getActionsFromValues')

describe('getActionsFromValues', () => {
  beforeEach(() => {
    getKegSettingMock.mockClear()
    loadConfigFilesMock.mockClear()
  })
  afterAll(() => jest.resetAllMocks())
  testEnum(testArgs, getActionsFromValues)
})
