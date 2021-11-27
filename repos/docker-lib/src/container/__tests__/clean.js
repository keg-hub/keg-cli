const { dockerCmds } = require('../../__mocks__')

jest.setMock('../containerCmd', { containerCmd: dockerCmds.containerCmd })

const listMock = jest.fn(() => {
  return [
    {
      id: '1234',
      name: 'test 1',
      status: 'Running',
    },
    {
      id: '4321',
      name: 'test 2',
      status: 'Exited',
    },
  ]
})
jest.setMock('../list', { list: listMock })

const { clean } = require('../clean')

describe('clean', () => {

  afterEach(() => {
    listMock.mockClear()
    dockerCmds.containerCmd.mockClear()
  })

  afterAll(() => jest.resetAllMocks())

  it('should run docker container list command to get all containers', async () => {
    expect(listMock).not.toHaveBeenCalled()
    const resp = await clean({ log: true, opts: [], format: 'json', skipError: true })
    expect(listMock).toHaveBeenCalled()
  })

  it('should run containerCmd with clean params for only stopped containers', async () => {
    expect(dockerCmds.containerCmd).not.toHaveBeenCalled()
    const resp = await clean({ log: true, opts: [], format: 'json', skipError: true })

    expect(dockerCmds.containerCmd).toHaveBeenCalledWith({
      log: true,
      format: 'json',
      skipError: true,
      opts: [ 'rm', '4321' ]
    })

  })
  
})


