
const { portToJson } = require('../portToJson')

describe('portToJson', () => {

  afterAll(() => jest.resetAllMocks())

  it('It should convert the port string data into a JSON object', () => {
    const portObj = portToJson(`7890/tcp -> 0.0.0.0:4321\n9876/tcp -> 0.0.0.0:1234`)
    expect(portObj['4321']).toBe(7890)
    expect(portObj['1234']).toBe(9876)
  })

  it('It should handle a single string as the first argument and the port as the second', () => {
    const portObj = portToJson(`0.0.0.0:4321\n`, '7890/tcp')
    expect(portObj['4321']).toBe(7890)
  })

  it('It should handle converting to JSON object without the protocol included', () => {
    const portObj = portToJson(`7890 -> 0.0.0.0:4321\n9876 -> 0.0.0.0:1234`)
    expect(portObj['4321']).toBe(7890)
    expect(portObj['1234']).toBe(9876)

    const portObj2 = portToJson(`0.0.0.0:4321`, '7890')
    expect(portObj2['4321']).toBe(7890)
  })

})