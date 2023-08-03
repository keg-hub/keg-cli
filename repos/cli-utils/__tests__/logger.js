jest.resetAllMocks()
jest.clearAllMocks()

const logMock = jest.fn()
jest.setMock(`../src/logger/logger`, {
  Log: function () { this.log = logMock },
  Logger: { log: logMock }
})

const { Logger, Log } = require('../logger')
describe("Logger", () => {

  afterAll(() => {
    logMock.mockClear()
  })

  it(`should call the log method for the Logger export`, () => {
    Logger.log(``)
    expect(logMock).toHaveBeenCalled()
  })

  it(`should call the log method for instance of the Log class`, () => {
    const log = new Log()
    log.log()
    expect(logMock).toHaveBeenCalled()
  })

})
