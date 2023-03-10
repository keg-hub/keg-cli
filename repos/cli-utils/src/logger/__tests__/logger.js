jest.resetModules()
jest.resetAllMocks()

const { Logger, Log }  = require('../logger')

const orgLog = console.log
console.log = jest.fn()
const orgErr = console.error
console.error = jest.fn()
const orgTable = console.table
console.table = jest.fn()


describe('Logger', () => {

  beforeEach(() => {
    console.log.mockClear()
    console.error.mockClear()
    console.table.mockClear()
  })
  
  afterAll(() => {
    console.log = orgLog
    console.error = orgErr
    console.table = orgTable
  })
  
  describe('setTag', () => {
    beforeEach(() => {
      console.log.mockClear()
      console.error.mockClear()
      console.table.mockClear()
    })
    test(`should add a tag to Logger.log messages`, () => {
      Logger.setTag(`[Log Test Tag]`)
      Logger.log(`Test data to be logged`)
      const text = console.log.mock.calls[0][0]
      expect(text.startsWith(`[Log Test Tag]`)).toBe(true)
    })
    test(`should add a tag to Logger.error messages`, () => {
      Logger.setTag(`[Error Test Tag]`)
      Logger.error(`Test data to be logged`)
      const text = console.error.mock.calls[0][0]
      expect(text.startsWith(`[Error Test Tag]`)).toBe(true)
    })
    test(`should log the tag when Logger.table is called`, () => {
      orgTable.apply(console, [{ test: `Test data to be logged`}])
      Logger.setTag(`[Table Test Tag]`)
      Logger.table([{ test: `Test data to be logged`}])
      const text = console.table.mock.calls[0][0]
      expect(text.startsWith(`[Table Test Tag]`)).toBe(true)
    })
  })

})