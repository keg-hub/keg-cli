const { get } = require('@keg-hub/jsutils')
const { dockerCmds } = require('../../__mocks__')
const { inspect:inspectCmd } = dockerCmds

jest.setMock('../../cmds/inspect', { inspect: inspectCmd })

const { inspect } = require('../inspect')

describe('inspect', () => {

  afterAll(() => jest.resetAllMocks())

  afterEach(() => {
    inspectCmd.mockClear()
  })

  it('Should call the docker inspect command', async () => {
    expect(inspectCmd).not.toHaveBeenCalled()
    await inspect()
    expect(inspectCmd).toHaveBeenCalled()
  })

  it('Should set the type to image', async () => {
    await inspect()
    const noArgs = get(inspectCmd.mock, 'calls.0.0')
    expect(noArgs.type).toBe('image')

    await inspect({ type: 'test' })
    const argTypeTest = get(inspectCmd.mock, 'calls.1.0')
    expect(argTypeTest.type).toBe('image')
  })

  it('should all other arguments to the inspect method', async () => {
    await inspect({ testArg: 'I am a test arg' })
    const testArg = get(inspectCmd.mock, 'calls.0.0.testArg')
    expect(testArg).toBe('I am a test arg')
  })

})