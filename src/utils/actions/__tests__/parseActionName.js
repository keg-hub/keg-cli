
const { parseActionName } = require('../parseActionName')

describe('parseActionName', () => {

  it('should return the value after the last /', () => {
    const dependency = '/my/dep/name/test'
    expect(parseActionName(dependency)).toBe('/my/dep/name/test')
  })

  it('should use the remotePath, when dependency is undefined', () => {
    const remotePath = '/my/dep/name/test'
    expect(parseActionName(null, remotePath)).toBe('test')
  })

  it('should remove the first underscore within the remotePath name', () => {
    const remotePath = '/my/dep/name/testRemove'
    expect(parseActionName(null, remotePath)).toBe('testRemove')
  })

  it('should remove the first hyphen within the remotePath name', () => {
    const remotePath = '/my/dep/name/testRemove'
    expect(parseActionName(null, remotePath)).toBe('testRemove')
  })

})
