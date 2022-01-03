const globalConfig = global.getGlobalCliConfig()
const { DOCKER } = require('KegConst/docker')
const { generatedLabels } = require('KegMocks/libs/docker/compose')
const { injectedTest } = require('KegMocks/injected/injectedTest')
const { coreEnvs } = require('KegMocks/injected/injectedCore')
const { generateComposeLabels } = require('../generateComposeLabels')

const args = {
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
  injected: {
    globalConfig,
    proxyDomain: 'injected',
    ...injectedTest
  }
}

describe('generateComposeLabels', () => {

  afterAll(() => jest.resetAllMocks())

  it('It generate the correct labels for keg-core', async () => {
    const labels = generateComposeLabels(args.core)
    expect(labels).toEqual(generatedLabels.core)
  })

  it('It generate the correct labels for injected apps', async () => {
    const labels = generateComposeLabels(args.injected)
    expect(labels).toEqual(generatedLabels.injected)
  })

})
