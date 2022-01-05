const { get, isArr } = require('@keg-hub/jsutils')
const { dockerCli } = require('../../__mocks__/commands')
jest.setMock('../../cmds/dockerCli', { dockerCli })

const { list } = require('../list')

describe('list', () => {

  afterAll(() => jest.resetAllMocks())

  afterEach(() => {
    dockerCli.mockClear()
  })

  it('Should return an array of all images', async () => {
    const images = await list()
    expect(isArr(images)).toBe(true)
    expect(images.length).toBe(Object.values(global.testDocker.images).length)
  })

  it('should pass the image ls command to docker', async () => {
    await list()
    const cmdOpts = get(dockerCli.mock, 'calls.0.0.opts')
    expect(cmdOpts[0]).toBe('image')
    expect(cmdOpts[1]).toBe('ls')

    const format = get(dockerCli.mock, 'calls.0.0.format')
    expect(format).toBe('json')
  })

  it('should allow overwriting the format option', async () => {
    await list({ format: 'test-format' })
    const format = get(dockerCli.mock, 'calls.0.0.format')
    expect(format).toBe('test-format')
  })

  it('should all other arguments to the dockerCLI method', async () => {
    await list({ testArg: 'I am a test arg' })
    const testArg = get(dockerCli.mock, 'calls.0.0.testArg')
    expect(testArg).toBe('I am a test arg')
  })

})
