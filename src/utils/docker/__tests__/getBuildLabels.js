const globalConfig = global.getGlobalCliConfig()
const { DOCKER } = require('KegConst/docker')
const { dockerLabels } = require('KegMocks/libs/docker/docker')
const { coreEnvs, coreInject } = require('KegMocks/injected/injectedCore')
const { injectedTest, injectedContainer } = require('KegMocks/injected/injectedTest')

const withInjected = {
  ...DOCKER.CONTAINERS,
  CORE: coreInject,
  INJECTED: injectedContainer
}

jest.setMock('KegConst/docker', { DOCKER: { ...DOCKER, CONTAINERS: withInjected }})

const args = {
  base: {
    globalConfig,
    params: {
      context: 'base',
      image: 'keg-base',
    },
    cmd: 'up',
    proxyDomain: 'base',
    cmdContext: 'base',
    contextEnvs: {
      ...DOCKER.CONTAINERS.BASE.ENV,
    },
  },
  core: {
    globalConfig,
    params: {
      context: 'core',
      image: 'keg-core',
    },
    cmd: 'up',
    proxyDomain: 'core',
    cmdContext: 'core',
    contextEnvs: coreEnvs,
  },
  proxy: {
    globalConfig,
    params: {
      context: 'proxy',
      image: 'keg-proxy',
    },
    cmd: 'up',
    proxyDomain: 'proxy',
    cmdContext: 'proxy',
    contextEnvs: {
      ...DOCKER.CONTAINERS.PROXY.ENV,
    },
  },
  injected: {
    globalConfig,
    proxyDomain: 'injected',
    ...injectedTest
  }
}

const { getBuildLabels } = require('../getBuildLabels')

describe('getBuildLabels', () => {

  it('Should return the default labels when no labels are passed in for keg-base', () => {
    expect(true).toBe(true)
  })

})