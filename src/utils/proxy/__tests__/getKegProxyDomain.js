require('KegMocks/libs/docker')
const { injectedTest } = require('KegMocks/injected/injectedTest')
const globalConfig = global.getGlobalCliConfig()
const { coreEnvs } = require('KegMocks/injected/injectedCore')

const args = {
  core: {
    globalConfig,
    params: {
      context: 'core',
    },
    cmdContext: 'core',
    contextData: {
      context: 'core',
      noPrefix: 'keg-core',
      prefix: undefined,
      cmdContext: 'core',
    },
    contextEnvs: coreEnvs,
  },
  coreNoId: {
    globalConfig,
    params: {
      context: 'core',
      image: 'keg-core',
    },
    cmdContext: 'core',
    contextData: {
      context: 'core',
      image: 'keg-core',
      ...global.testDocker.images.core,
    },
    contextEnvs: coreEnvs,
  },
  injected: {
    globalConfig,
    ...injectedTest
  }
}

const proxyDomainMocks = {
  'keg-core': `proxy-domain-add-plugin`,
  'tap-test': `proxy-domain-tap-feature`,
  'tap-injected-test': 'injected-proxy-value'
}

const domainFromLabel = jest.fn((itemRef, type) => {
  return `${itemRef}-${type}`
})
jest.setMock('../getProxyDomainFromLabel', { getProxyDomainFromLabel: domainFromLabel })

const domainFromBranch = jest.fn((context, path) => {
  return proxyDomainMocks[context]
})
jest.setMock('../getProxyDomainFromBranch', { getProxyDomainFromBranch: domainFromBranch })

const { getKegProxyDomain } = require('../getKegProxyDomain')

describe('getKegProxyDomain', () => {

  beforeEach(() => {
    domainFromBranch.mockClear()
    domainFromLabel.mockClear()
  })

  afterAll(() => jest.resetAllMocks())

  it('Should get the domain from git when id || rootId is NOT passed', async () => {
    expect(domainFromBranch).not.toHaveBeenCalled()
    expect(domainFromLabel).not.toHaveBeenCalled()
    const proxyDomain = await getKegProxyDomain(args.core, args.core.contextEnvs)
    expect(domainFromBranch).toHaveBeenCalled()
    expect(domainFromLabel).not.toHaveBeenCalled()
  })

  it('Should get the domain from label when id || rootId is passed', async () => {
    expect(domainFromBranch).not.toHaveBeenCalled()
    expect(domainFromLabel).not.toHaveBeenCalled()
    const proxyDomain = await getKegProxyDomain(args.coreNoId, args.coreNoId.contextEnvs)
    expect(domainFromLabel).toHaveBeenCalled()
    expect(domainFromBranch).not.toHaveBeenCalled()
  })

  it('Should get the domain from label with image and tag and no id', async () => {
    expect(domainFromBranch).not.toHaveBeenCalled()
    expect(domainFromLabel).not.toHaveBeenCalled()

    const rootId = args.coreNoId.contextEnvs.rootId
    const proxyDomain = await getKegProxyDomain({
      ...args.coreNoId,
      params: {
        image: 'keg-core',
        tag: 'develop'
      },
      contextData: {}
    }, args.coreNoId.contextEnvs)

    expect(proxyDomain).toBe('keg-core:develop-container')

    expect(domainFromLabel).toHaveBeenCalled()
    expect(domainFromBranch).not.toHaveBeenCalled()
  })

  it('Should set the type as image, when rootId exists', async () => {
    expect(domainFromBranch).not.toHaveBeenCalled()
    expect(domainFromLabel).not.toHaveBeenCalled()

    const rootId = args.coreNoId.contextEnvs.rootId
    const proxyDomain = await getKegProxyDomain({
      ...args.coreNoId,
      params: {
        image: 'keg-core',
        tag: 'develop'
      },
      contextData: { rootId: 'keg-core' }
    }, args.core.contextEnvs)

    expect(proxyDomain).toBe('keg-core:develop-image')

    expect(domainFromLabel).toHaveBeenCalled()
    expect(domainFromBranch).not.toHaveBeenCalled()
  })

  it('Should use the __injected tap value when it exists', async () => {
    expect(domainFromBranch).not.toHaveBeenCalled()
    expect(domainFromLabel).not.toHaveBeenCalled()
    const proxyDomain = await getKegProxyDomain(args.injected, args.injected.contextEnvs)

    expect(proxyDomain).toBe(proxyDomainMocks[injectedTest.params.__injected.tap])

    expect(domainFromBranch).toHaveBeenCalled()
    expect(domainFromLabel).not.toHaveBeenCalled()
  })

})
