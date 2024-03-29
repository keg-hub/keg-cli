const { Logger } = require('KegMocks/logger')
jest.setMock('@keg-hub/cli-utils', { Logger })

const { logCmd } = require('../logCmd')

describe('logCmd', () => {

  afterEach(() => jest.resetAllMocks())
  
  it('should call Logger.data when a response is passed', () => {

    logCmd({ test: 'foo' })
    expect(Logger.data).toHaveBeenCalled()

  })

  it('should NOT call Logger.success when response is passed', () => {

    logCmd({ test: 'foo' })
    expect(Logger.success).not.toHaveBeenCalled()

  })

  it('should call Logger.success when no res, but cmd is passed', () => {

    logCmd(undefined, 'testCmd')
    expect(Logger.success).toHaveBeenCalled()

  })

  it('should NOT call Logger.data when no res, but cmd is passed', () => {

    logCmd(undefined, 'testCmd')
    expect(Logger.data).not.toHaveBeenCalled()

  })

  it('should NOT call Logger.data || Logger.success when res and cmd are not passed', () => {

    logCmd(undefined, 'testCmd')
    expect(Logger.data).not.toHaveBeenCalled()

  })

})