const { get } = require('@keg-hub/jsutils')
const { dockerCmds } = require('../../__mocks__')
const { remove:removeCmd } = dockerCmds

jest.setMock('../../cmds/remove', { remove: removeCmd })

const { remove } = require('../remove')

describe('remove', () => {

  afterAll(() => jest.resetAllMocks())

  afterEach(() => {
    removeCmd.mockClear()
  })

  it('Should call the docker remove command', async () => {
    expect(removeCmd).not.toHaveBeenCalled()
    await remove()
    expect(removeCmd).toHaveBeenCalled()
  })

  it('Should set the type to image', async () => {
    await remove()
    const noArgs = get(removeCmd.mock, 'calls.0.0')
    expect(noArgs.type).toBe('image')

    await remove({ type: 'test' })
    const argTypeTest = get(removeCmd.mock, 'calls.1.0')
    expect(argTypeTest.type).toBe('image')
  })

  it('should all other arguments to the remove method', async () => {
    await remove({ testArg: 'I am a test arg' })
    const testArg = get(removeCmd.mock, 'calls.0.0.testArg')
    expect(testArg).toBe('I am a test arg')
  })

})
