
const { get } = require('@keg-hub/jsutils')
const { dockerCli } = require('../../__mocks__/commands')
jest.setMock('../../cmds/dockerCli', { dockerCli })

const { get:imgGet } = require('../get')

describe('Docker image get', () => {

  afterAll(() => jest.resetAllMocks())

  afterEach(() => {
    dockerCli.mockClear()
  })

  it('Should return a docker image', async () => {
    const baseImg = await imgGet('keg-base')
    expect(baseImg.rootId).toBe('keg-base')
    expect(baseImg.id).toBe('3b74af475ff2')

    const tapImg = await imgGet('tap')
    expect(tapImg.rootId).toBe('tap')
    expect(tapImg.id).toBe('a2aba7cf204f')
  })

  it('Should call the docker cli to get all images', async () => {
    expect(dockerCli).not.toHaveBeenCalled()
    const baseImg = await imgGet('keg-base')
    expect(dockerCli).toHaveBeenCalled()
    
    const cmdOpts = get(dockerCli.mock, 'calls.0.0.opts')
    expect(cmdOpts[0]).toBe('image')
    expect(cmdOpts[1]).toBe('ls')

    const format = get(dockerCli.mock, 'calls.0.0.format')
    expect(format).toBe('json')
  })

  it('Should accept a callback method as the second argument', async () => {
    const findCb = jest.fn((image, imgRef, tag) => image.rootId === 'keg-base')
    const baseImg = await imgGet('keg-base', findCb)
    
    expect(findCb).toHaveBeenCalled()
    expect(baseImg.rootId).toBe('keg-base')
    expect(baseImg.id).toBe('3b74af475ff2')
  })

  it('Should find an image with a tag if it exists', async () => {
    const baseImg = await imgGet('keg-base:latest')
    expect(baseImg.rootId).toBe('keg-base')
    expect(baseImg.id).toBe('3b74af475ff2')

    const coreImg = await imgGet('keg-core:0.0.1')
    expect(coreImg.rootId).toBe('keg-core')
    expect(coreImg.id).toBe('b80dcb1cac10')
  })

  it('Should not find an image with a tag if it does not exists', async () => {
    const baseImg = await imgGet('keg-base:test-invalid')
    expect(baseImg).toBe(undefined)

    const coreImg = await imgGet('keg-core:2.5.0')
    expect(coreImg).toBe(undefined)
  })

  it('Should find an image from ID', async () => {
    const baseImg = await imgGet('3b74af475ff2')
    expect(baseImg.rootId).toBe('keg-base')
    expect(baseImg.id).toBe('3b74af475ff2')
  })

  it('Should get an image if the ID is passed with a tag that exists', async () => {
    const coreImg = await imgGet('b80dcb1cac10:0.0.1')
    expect(coreImg.rootId).toBe('keg-core')
    expect(coreImg.id).toBe('b80dcb1cac10')
  })

  it('Should not return an image if the ID matches but tag does not', async () => {
    const baseImg = await imgGet('3b74af475ff2:invalid')
    expect(baseImg).toBe(undefined)
  })

})
