const mockSpawn = jest.fn()
jest.setMock('../spawnCmd', { spawnCmd: mockSpawn })
const {pipeCmd} = require('../pipeCmd')

const cmd = `test pipeCmd call`

describe('/pipeCmd', () => {

  beforeEach(() => jest.resetAllMocks())

  it(`should call spawnCmd with the stdio set to pipe`, async () => {
    await pipeCmd(cmd, {})
    expect(mockSpawn).toHaveBeenCalled()

    const [argCmd, argOpts] = mockSpawn.mock.calls[0]
    expect(argCmd).toBe(cmd)
    expect(argOpts.options.stdio).toBe('pipe')
  })

  it(`should set the cwd option to the passed in option.cwd`, async () => {
    await pipeCmd(cmd, { cwd: 'my/custom/dir' })
    const argOpts = mockSpawn.mock.calls[0][1]
    expect(argOpts.cwd).toBe('my/custom/dir')
  })

  it(`should set the cwd option to the passed in third argument`, async () => {
    await pipeCmd(cmd, {}, 'my/custom/dir')
    const argOpts = mockSpawn.mock.calls[0][1]
    expect(argOpts.cwd).toBe('my/custom/dir')
  })

  it(`should set the cwd option to option.cwd when it and the third argument are passed`, async () => {
    await pipeCmd(cmd, { cwd: 'override/third/argument' }, 'my/custom/dir')
    const argOpts = mockSpawn.mock.calls[0][1]
    expect(argOpts.cwd).toBe('override/third/argument')
  })
  
  it(`should not add events when log.allow is false`, async () => {
    await pipeCmd(cmd, {logs: { allow: false}})
    const argOpts = mockSpawn.mock.calls[0][1]
    ;(['onStdOut', 'onStdErr', 'onExit']).map(key => {
      expect(argOpts[key]).toBe(undefined)
    })
  })

  it(`should add events when log.allow is true`, async () => {
    await pipeCmd(cmd, {logs: { allow: true}})
    const argOpts = mockSpawn.mock.calls[0][1]    
    ;(['onStdOut', 'onStdErr', 'onExit']).map(key => {
      expect(typeof argOpts[key]).toBe('function')
    })
  })

  it(`should add events when log.allow is not set, but eventHandlers exist`, async () => {
    const pipeArgs = {
      onStdOut: jest.fn(),
      onStdErr: jest.fn(),
      onError: jest.fn(),
      onExit: jest.fn(),
    }
    await pipeCmd(cmd, pipeArgs)
    const argOpts = mockSpawn.mock.calls[0][1]    
    ;(['onStdOut', 'onStdErr', 'onExit']).map(key => {
      expect(typeof argOpts[key]).toBe('function')
    })
  })

  it(`should wrap the all event handlers except for onError`, async () => {
    const pipeArgs = {
      onStdOut: jest.fn(),
      onStdErr: jest.fn(),
      onError: jest.fn(),
      onExit: jest.fn(),
    }
    await pipeCmd(cmd, pipeArgs)
    const argOpts = mockSpawn.mock.calls[0][1]    
    ;(['onStdOut', 'onStdErr', 'onExit']).map(key => {
      expect(argOpts[key]).not.toBe(pipeArgs[key])
    })
    expect(argOpts.onError).toBe(pipeArgs.onError)
  })

  it(`should forward top level properties to the spawnCmd call`, async () => {
    const pipeArgs = { test: 'some-prop'}
    await pipeCmd(cmd, pipeArgs)
    const argOpts = mockSpawn.mock.calls[0][1]
    expect(argOpts.test).toBe('some-prop')
  })

  it(`should forward options on to the spawnCmd call`, async () => {
    const pipeArgs = {options: { test: 'forward-option' }}
    await pipeCmd(cmd, pipeArgs)
    const argOpts = mockSpawn.mock.calls[0][1]
    expect(argOpts.options.test).toBe('forward-option')
  })

})