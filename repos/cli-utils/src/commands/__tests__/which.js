jest.resetModules()
jest.resetAllMocks()
jest.clearAllMocks()

const spawnCmdMock = jest.fn()
const asyncCmdMock = jest.fn((...args) => {
  const resp = args[0] === `which cat`
    ? { error: ``, data: `/some/test/cat`, exitCode: 0 }
    : { error: ``, data: ``, exitCode: 1 }

  return resp
})
jest.setMock('@keg-hub/spawn-cmd', { spawnCmd: spawnCmdMock, asyncCmd: asyncCmdMock })

const { which } = require('../which')
  
describe('which', () => {

  beforeEach(() => {
    spawnCmdMock.mockClear()
    asyncCmdMock.mockClear()
  })

  it('should return the path when the executable is in path', async () => {
    const data = await which(`cat`)
    expect(data).toBe(`/some/test/cat`)
  })
  
  it('should throw an error when executable does not exist', async () => {
    await expect(which(`__SOME_RANDOM_TEXT_`))
    .rejects
    .toThrow(`__SOME_RANDOM_TEXT_ not found`)
  })

  it('should return false when executable does not exist and the second argument is false', async () => {
    const data = await which(`__SOME_RANDOM_TEXT_`, false)
    expect(data).toBe(false)
  })
  
})
