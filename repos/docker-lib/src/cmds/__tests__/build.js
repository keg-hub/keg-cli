const cliUtils = require('@keg-hub/cli-utils')

const mockRunCmd = jest.fn((cmd, args, options={}) => {
  return options.exitCode || 0
})
jest.setMock('@keg-hub/cli-utils', {
  ...cliUtils,
  runCmd: mockRunCmd
})

const apiErrorMock = jest.fn()
jest.setMock('../../utils/error/apiError', {
  apiError: apiErrorMock
})


const commands = [
  [
    'goat',
    { log: false, args: [ '--no-cache', '-r' ], cwd: '/some/path', exitCode: 0 },
    '/some/other/path'
  ],
  [
    'goat',
    { log: false, args: [ '--no-cache', '-r' ]},
    '/some/other/path'
  ],
  [
    undefined,
    { log: false, args: [ '--no-cache', '-r' ]},
    '/some/other/path'
  ],
  [
    'with-exit-code',
    { log: false, args: [ '--no-cache', '-r' ], cwd: '/some/path', exitCode: 1 },
  ]
  
]

const { build } = require('../build')

describe('build', () => {
  
  afterEach(() => {
    mockRunCmd.mockClear()
    apiErrorMock.mockClear()
  })
  
  it('should pass the correct arguments to the runCmd', async () => {
    expect(mockRunCmd).not.toHaveBeenCalled()
    await build(...commands[0])
    expect(mockRunCmd).toHaveBeenCalledWith(
      'docker build goat',
      [ '--no-cache', '-r' ],
      { cwd: '/some/path', exitCode: 0 }
    )
  })

  it('should use location when no options.cwd exists', async () => {
    expect(mockRunCmd).not.toHaveBeenCalled()
    await build(...commands[1])
    expect(mockRunCmd).toHaveBeenCalledWith(
      'docker build goat',
      [ '--no-cache', '-r' ],
      { cwd: '/some/other/path' }
    )
  })

  it('should work when no command is passed', async () => {
    expect(mockRunCmd).not.toHaveBeenCalled()
    await build(...commands[2])
    expect(mockRunCmd).toHaveBeenCalledWith(
      'docker build',
      [ '--no-cache', '-r' ],
      { cwd: '/some/other/path' }
    )
  })


  it('should not call apiError when a 0 exitCode is returned', async () => {
    await build(...commands[0])
    expect(apiErrorMock).not.toHaveBeenCalled()
  })

  it('should call apiError when a non-zero exit code is returned from runCmd', async () => {
    expect(mockRunCmd).not.toHaveBeenCalled()
    await build(...commands[3])
    expect(apiErrorMock).toHaveBeenCalledWith('Docker image failed to build!')
  })
  
})