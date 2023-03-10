const ip = '71.226.115.13'

const mockGet = jest.fn((conf, cb) => {
  const resp = {
    called: false,
    on: (type, cb) => {
      if(resp.called) return
      resp.called = true
      type === `data` ? cb(ip) : cb(`test error`)
    }
  }
  cb(resp)
})

jest.setMock('http', { get: mockGet })

const { getPublicIP } = require('../getPublicIP')

describe('getPublicIP', () => {

  const ip = '71.226.115.13'
  beforeEach(() => {
    mockGet.mockClear()
  })

  it('should obtain the public ip from the api', async () => {
    const pIp = await getPublicIP()
    expect(pIp).toEqual(ip)
    expect(mockGet).toHaveBeenCalled()
  })
})