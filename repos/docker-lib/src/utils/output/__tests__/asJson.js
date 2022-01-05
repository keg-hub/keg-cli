const { dockerOutput } = require('../../../__mocks__')

const { asJson } = require('../asJson')
describe('asJson', () => {
  afterAll(() => jest.resetAllMocks())

  it('It should convert the dockerCLI output into a jsonObject', () => {
    const containers = asJson(dockerOutput.container.list)
    expect(containers.length).toBe(2)
    expect(containers[0].id).toBe('084a9d7ab5c5')
  })

})
