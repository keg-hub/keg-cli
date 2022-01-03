const { docker } = require('KegMocks/libs/docker')
const globalConfig = global.getGlobalCliConfig()
const testTask = global.getTask()
const unloadEnvs = global.loadMockEnvs()
const { DOCKER } = require('KegConst/docker')
const { coreInject } = require('KegMocks/injected/injectedCore')

const withInjected = {
  ...DOCKER.CONTAINERS,
  CORE: coreInject,
}
jest.setMock('KegConst/docker', { DOCKER: { ...DOCKER, CONTAINERS: withInjected }})

jest.setMock('@keg-hub/docker-lib', docker)
const { buildContainerContext } = require('../buildContainerContext')

describe('buildContainerContext', () => {

  afterAll(() => {
    jest.resetAllMocks()
    unloadEnvs()
  })

  it('should return an object with keys cmdContext, contextEnvs, location, and tap', async () => {

    const res = await buildContainerContext({
      globalConfig,
      params: { context: 'base' },
      task: testTask,
      envs: {},
    })

    const resKeys = Object.keys(res)
    const keys = [
      'cmdContext',
      'contextEnvs',
      'location',
      'tap',
      'image',
      'withPrefix',
      'noPrefix',
    ]

    keys.map(key => { expect(resKeys.indexOf(key)).not.toBe(-1) })

  })

  it('should return the contextEnvs for the base context', async () => {

    const { contextEnvs } = await buildContainerContext({
      globalConfig,
      params: { context: 'base' },
      task: testTask,
      envs: {},
    })
    
    expect(contextEnvs.KEG_CONTEXT_PATH
      .indexOf('/keg-hub'))
      .not.toBe(-1)

    expect(contextEnvs.KEG_DOCKER_FILE
      .indexOf('/keg-hub/repos/keg-cli/containers/base/Dockerfile'))
      .not.toBe(-1)

    expect(contextEnvs.KEG_VALUES_FILE
      .indexOf('/keg-hub/repos/keg-cli/containers/base/values.yml'))
      .not.toBe(-1)

    expect(contextEnvs.KEG_COMPOSE_DEFAULT
      .indexOf('/keg-hub/repos/keg-cli/containers/base/docker-compose.yml'))
      .not.toBe(-1)

    expect(contextEnvs.IMAGE).toBe('keg-base')
    expect(contextEnvs.CONTAINER_NAME).toBe('keg-base')

  })


  it('should return the contextEnvs for the core context', async () => {

    const { contextEnvs } = await buildContainerContext({
      globalConfig,
      params: { context: 'core' },
      task: testTask,
      envs: {},
    })
    
    expect(contextEnvs.KEG_CONTEXT_PATH
      .indexOf('/keg-hub/repos/keg-core'))
      .not.toBe(-1)

    expect(contextEnvs.KEG_DOCKER_FILE
      .indexOf('/keg-hub/repos/keg-core/container/Dockerfile'))
      .not.toBe(-1)

    expect(contextEnvs.KEG_VALUES_FILE
      .indexOf('/keg-hub/repos/keg-core/container/values.yml'))
      .not.toBe(-1)

    expect(contextEnvs.KEG_COMPOSE_DEFAULT
      .indexOf('/keg-hub/repos/keg-core/container/docker-compose.yml'))
      .not.toBe(-1)

    expect(contextEnvs.IMAGE).toBe('keg-core')
    expect(contextEnvs.CONTAINER_NAME).toBe('keg-core')

  })

})
