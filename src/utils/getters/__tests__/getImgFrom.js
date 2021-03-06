const { docker } = require('KegMocks/libs/docker')
const { testEnum } = require('KegMocks/jest/testEnum')
const { coreInject } = require('KegMocks/injected/injectedCore')
const { injectedContainer } = require('KegMocks/injected/injectedTest')

const { DOCKER } = require('KegConst/docker')
const withInjected = {
  ...DOCKER.CONTAINERS,
  CORE: coreInject,
  INJECTED: injectedContainer
}
jest.setMock('KegConst/docker', { DOCKER: { ...DOCKER, CONTAINERS: withInjected }})
jest.setMock('@keg-hub/docker-lib', docker)

const { getImgFrom } = require('../getImgFrom')

const testArgs = {
  context: {
    description: 'It should return KEG_BASE_FROM env for the passed in context',
    inputs: [ { context: 'core' }, {} ],
    outputs: 'ghcr.io/keg-hub/keg-core:develop'
  },
  contextEnvs: {
    description: 'It should return KEG_BASE_FROM env from passed in ENVs over the context',
    inputs: [ { context: 'tap' }, { KEG_IMAGE_FROM: 'test-tap:override' } ],
    outputs: 'test-tap:override'
  },
  fromParams: {
    description: 'It should return from param when it exists',
    inputs: [ { context: 'tap', from: 'test-param-from:test-tag' } ],
    outputs: 'test-param-from:test-tag'
  },
  fromOverrideEvs: {
    description: 'It should use the from param over the context envs',
    inputs: [{ from: 'from-override:test-tag' }, { KEG_IMAGE_FROM: 'test-tap:override' }, 'tap'],
    outputs: 'from-override:test-tag'
  },
  fromOverrideContext: {
    description: 'It should use the from param over the context',
    inputs: [{ context: 'core', from: 'from-override:test-tag' }, {}, 'core'],
    outputs: 'from-override:test-tag'
  },
}

describe('getImgFrom', () => {

  afterAll(() => jest.resetAllMocks())

  testEnum(testArgs, getImgFrom)

})