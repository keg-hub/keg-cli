const { DOCKER } = require('KegConst/docker')
const { getTask } = require('KegMocks/helpers/testTasks')
const { deepMerge, get, uuid } = require('@keg-hub/jsutils')
const tagHelpers = require('KegUtils/docker/tags/tagHelpers')
const { allowedTagOpts } = require('../../../getters/getTagVarMap')
const { coreEnvs, coreInject } = require('KegMocks/injected/injectedCore')
const { containerContexts } = require('KegMocks/contexts/containerContexts')
const { injectedTest, injectedContainer, injectedContext } = require('KegMocks/injected/injectedTest')

const gitTagHash = uuid()

const getRepoGitTagMock = jest.fn((params, method) => {
  return method === 'commit'
    ? gitTagHash
    : 'git-test-branch'
})

jest.setMock('KegUtils/docker/tags/tagHelpers', { ...tagHelpers, getRepoGitTag: getRepoGitTagMock })

const globalConfig = global.getGlobalCliConfig()

const withInjected = {
  ...DOCKER.CONTAINERS,
  CORE: coreInject,
  INJECTED: injectedContainer,
}

jest.setMock('KegConst/docker', { DOCKER: { ...DOCKER, CONTAINERS: withInjected }})

const defParams = {
  local: false,
  tags: undefined,
  version: undefined,
  tagVariable: undefined,
  tagGit: false,
  tagPackage: false,
  from: undefined,
  pull: true,
  cache: true,
  log: false,
  env: globalConfig.cli.settings.defaultEnv,
}

const testTask = {
  ...getTask(),
  options: {
    tagVariable: {
      allowed: allowedTagOpts,
      description: 'test tag option',
    }
  }
}

const args = {
  base: {
    globalConfig,
    task: testTask,
    command: 'base',
    containerContext: containerContexts.base,
    params: {
      ...defParams,
      context: 'base',
      tap: 'base',
      location: DOCKER.CONTAINERS.BASE.ENV.KEG_CONTEXT_PATH,
      cmd: 'build',
      image: 'keg-base',
      buildArgs: {
        ...DOCKER.CONTAINERS.BASE.ENV,
      },
    },
  },
  core: {
    globalConfig,
    task: testTask,
    command: 'core',
    containerContext: containerContexts.core,
    params: {
      ...defParams,
      context: 'core',
      tap: 'core',
      location: coreEnvs.KEG_CONTEXT_PATH,
      cmd: 'core',
      image: 'keg-core',
      buildArgs: coreEnvs,
    },
  },
  injected: {
    globalConfig,
    task: testTask,
    ...injectedTest,
    params: {
      ...defParams,
      ...injectedTest.params,
      buildArgs: injectedTest.contextEnvs,
    },
    containerContext: injectedContext,
    command: 'tap-injected-test',
  }
}

const baseVersion = DOCKER.CONTAINERS.BASE.ENV.VERSION
const coreVersion = coreEnvs.VERSION

const buildParams = (type, overrides) => {
  return deepMerge(get(args, [ type, 'params']), overrides)
}

const { buildTags } = require('../buildTags')

describe('buildTags', () => {

  beforeEach(() => {
    getRepoGitTagMock.mockClear()
  })

  afterAll(() => jest.resetAllMocks())

  it('should get the image name from the passed in param', async () => {

    const coreResp = await buildTags(args.core, buildParams('core', { image: 'duper' }))
    expect(coreResp.trim()).toBe('-t ghcr.io/keg-hub/duper:develop')

  })

  it('should get the image name from constants when no image param is passed', async () => {

    const coreImg = coreEnvs.IMAGE
    const coreResp = await buildTags(args.core, args.core.params)
    expect(coreResp.trim()).toBe(`-t ghcr.io/keg-hub/${coreImg}:develop`)

  })

  it('should add tags defined in the tags param', async () => {

    const baseResp = await buildTags(args.base, buildParams('base', { tags: [ 'develop' ] }))
    expect(baseResp.trim()).toBe('-t ghcr.io/keg-hub/keg-base:develop')

    const coreResp = await buildTags(args.core, buildParams('core', { tags: [ 'test', '1.0.0' ] }))
    expect(coreResp.trim()).toBe('-t ghcr.io/keg-hub/keg-core:test -t ghcr.io/keg-hub/keg-core:1.0.0')

  })

  it('should add the default tag, when no tag params are set', async () => {

    const baseResp = await buildTags(args.base, args.base.params)
    expect(baseResp.trim()).toBe('-t ghcr.io/keg-hub/keg-base:develop')

    const coreResp = await buildTags(args.core, args.core.params)
    expect(coreResp.trim()).toBe('-t ghcr.io/keg-hub/keg-core:develop')

  })

  it('should use the version param with the env as a tag when passed as a string', async () => {

    const baseResp = await buildTags(args.base, buildParams('base', { version: 'test-version' }))
    expect(baseResp.trim()).toBe('-t ghcr.io/keg-hub/keg-base:local-test-version')

    const coreResp = await buildTags(args.core, buildParams('core', { version: '1.0.0' }))
    expect(coreResp.trim()).toBe('-t ghcr.io/keg-hub/keg-core:local-1.0.0')

  })

  it('should use the constants version with the env when version is passed as true', async () => {

    const baseResp = await buildTags(args.base, buildParams('base', { version: true }))
    expect(baseResp.trim()).toBe(`-t ghcr.io/keg-hub/keg-base:local-${baseVersion}`)

    const coreResp = await buildTags(args.core, buildParams('core', { version: true }))
    expect(coreResp.trim()).toBe(`-t ghcr.io/keg-hub/keg-core:local-${coreVersion}`)

  })


  it('should use the git branch when tagGit param is set', async () => {

    expect(getRepoGitTagMock).not.toHaveBeenCalled()

    const baseResp = await buildTags(args.base, buildParams('base', { tagGit: true }))
    expect(baseResp.trim()).toBe('-t ghcr.io/keg-hub/keg-base:git-test-branch')

    const coreResp = await buildTags(args.core, buildParams('core', { tagGit: true }))
    expect(coreResp.trim()).toBe('-t ghcr.io/keg-hub/keg-core:git-test-branch')

    expect(getRepoGitTagMock).toHaveBeenCalled()

  })

  it('should use the git commit hash when tagGit param value is commit', async () => {

    expect(getRepoGitTagMock).not.toHaveBeenCalled()

    const baseResp = await buildTags(args.base, buildParams('base', { tagGit: 'commit' }))
    expect(baseResp.trim()).toBe(`-t ghcr.io/keg-hub/keg-base:${gitTagHash}`)

    const coreResp = await buildTags(args.core, buildParams('core', { tagGit: 'commit' }))
    expect(coreResp.trim()).toBe(`-t ghcr.io/keg-hub/keg-core:${gitTagHash}`)

    expect(getRepoGitTagMock).toHaveBeenCalled()

  })

  it('should get a dynamic tag when tagVariable param is set to a valid value', async () => {

    const baseResp = await buildTags(args.base, buildParams('base', { tagVariable: ['commit:version'] }))
    expect(baseResp.trim()).toBe(`-t ghcr.io/keg-hub/keg-base:${gitTagHash}-${baseVersion}`)

    const coreResp = await buildTags(args.core, buildParams('core', { tagVariable: ['env:branch'] }))
    expect(coreResp.trim()).toBe(`-t ghcr.io/keg-hub/keg-core:local-git-test-branch`)

  })

})