const cliUtils = require('@keg-hub/cli-utils')
const { publicMock: public, privateMock: private } = require('@keg-hub/cli-utils/mocks')

const _oldLog = console.log
const orgPrivIps = cliUtils.getPrivateIPs
const orgPubIps = cliUtils.getPublicIP
const orgPubIpUrl = cliUtils.getPublicIPsForUrl

cliUtils.getPublicIP = jest.fn(async () => (public))
cliUtils.getPrivateIPs = jest.fn(async () => ([private]))
cliUtils.getPublicIPsForUrl = jest.fn(() => ([public]))


const { ip } = require('../ip')

describe('ip', () => {
  
  
  beforeAll(() => {
    console.log = jest.fn()
  })
  
  beforeEach(() => {
    console.log.mockClear()
    cliUtils.getPrivateIPs.mockClear()
    cliUtils.getPublicIP.mockClear()
    cliUtils.getPublicIPsForUrl.mockClear()
  })

  afterAll(() => {
    console.log = _oldLog
    cliUtils.getPrivateIPs = orgPrivIps
    cliUtils.getPublicIP = orgPubIps
    cliUtils.getPublicIPsForUrl = orgPubIpUrl
  })

  it('should print out the public and private ips when passed no params', async () => {
    await ip.action({
      params: {}
    })

    expect(console.log).toHaveBeenLastCalledWith({
      public,
      private,
    })
  })

  it('should print the public ip', async () => {
    await ip.action({ params: { public: true } })
    expect(console.log).toHaveBeenLastCalledWith(public)
  })

  it('should print the private ip', async () => {
    await ip.action({ params: { private: true } })
    expect(console.log).toHaveBeenLastCalledWith(private)
  })

  it('should get the ip for a url', async () => {
    await ip.action({ params: { url: 'archive.org' } })
    expect(console.log).toHaveBeenLastCalledWith(public)
  })

})