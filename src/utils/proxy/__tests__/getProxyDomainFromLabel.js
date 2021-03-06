const { docker, dockerObjLabels } = require('KegMocks/libs/docker')
jest.setMock('@keg-hub/docker-lib', docker)
const KEG_PROXY_DOMAIN = 'com.keg.proxy.domain'

const { getProxyDomainFromLabel } = require('../getProxyDomainFromLabel')

describe('getProxyDomainFromLabel', () => {

  beforeEach(() => {
    docker.container.inspect.mockClear()
    docker.image.inspect.mockClear()
  })

  afterAll(() => jest.resetAllMocks())

  it('Should return the correct proxyDomain for a tap', async () => {
    expect(docker.container.inspect).not.toHaveBeenCalled()
    const proxyDomain = await getProxyDomainFromLabel('tap')
    expect(proxyDomain).toBe(dockerObjLabels.tap[KEG_PROXY_DOMAIN])
    expect(docker.container.inspect).toHaveBeenCalled()
  })

  it('Should call the image inspect method when image is passed in', async () => {
    expect(docker.image.inspect).not.toHaveBeenCalled()
    expect(docker.container.inspect).not.toHaveBeenCalled()

    const proxyDomain = await getProxyDomainFromLabel('tap', 'image')

    expect(proxyDomain).toBe(dockerObjLabels.tap[KEG_PROXY_DOMAIN])
    expect(docker.image.inspect).toHaveBeenCalled()
    expect(docker.container.inspect).not.toHaveBeenCalled()
  })

})
