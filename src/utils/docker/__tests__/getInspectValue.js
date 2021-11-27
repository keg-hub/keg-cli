const { injectedTest, injectedContainer } = require('KegMocks/injected/injectedTest')
const { docker, dockerData } = require('KegMocks/libs/docker')
const { testEnum } = require('KegMocks/jest/testEnum')

const globalConfig = global.getGlobalCliConfig()
jest.setMock('../../globalConfig/globalConfigCache', {
  __getGlobalConfig: jest.fn(() => globalConfig)
})

const { DOCKER } = require('KegConst/docker')
const withInjected = {
  ...DOCKER.CONTAINERS,
  INJECTED: injectedContainer
}
jest.setMock('KegConst/docker', { DOCKER: { ...DOCKER, CONTAINERS: withInjected }})
jest.setMock('@keg-hub/docker-lib', docker)

console.log(dockerData.inspect.image.core)

const testArgs = {
  inspectObj: {
    description: 'It should return the inspect object',
    inputs: [ 'core' ],
    outputs: dockerData.inspect.image.core,
  },
  valueAtPath: {
    description: 'It should return the value from the inspectPath param',
    inputs: [ 'core', 'Config.Cmd.0' ],
    outputs: '/bin/bash'
  },
  containerInspect: {
    description: 'It should accept a type as the 3rd argument',
    inputs: [ 'tap', null, 'container' ],
    outputs: dockerData.inspect.container.tap,
  },
  containerInspectPath: {
    description: 'It should accept a type as the 3rd argument',
    inputs: [ 'tap', 'Config.Cmd.0', 'container' ],
    outputs: '/bin/bash'
  },
  asObj: {
    description: 'It should accept the first argument as an object',
    inputs: { item: 'core' },
    outputs: dockerData.inspect.image.core,
  },
  asObjContainer: {
    description: 'It should accept the first argument as an object',
    inputs: { item: 'tap', path: 'Config.Cmd.0', type: 'container' },
    outputs: '/bin/bash'
  },
}

const { getInspectValue } = require('../getInspectValue')


describe('getInspectValue', () => {

  afterAll(() => jest.resetAllMocks())

  testEnum(testArgs, getInspectValue, true)

})