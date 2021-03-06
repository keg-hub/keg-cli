const path = require('path')
const { DOCKER } = require('KegConst/docker')
const { getTask } = require('KegMocks/helpers/testTasks')
const { deepMerge, get, uuid } = require('@keg-hub/jsutils')
const tagHelpers = require('KegUtils/docker/tags/tagHelpers')
const { coreEnvs } = require('KegMocks/injected/injectedCore')
const { allowedTagOpts } = require('../../../getters/getTagVarMap')
const { containerContexts } = require('KegMocks/contexts/containerContexts')

const gitTagHash = uuid()

const getRepoGitTagMock = jest.fn((params, method) => {
  return method === 'commit'
    ? gitTagHash
    : 'git-test-branch'
})

jest.setMock('KegUtils/docker/tags/tagHelpers', { ...tagHelpers, getRepoGitTag: getRepoGitTagMock })

const globalConfig = global.getGlobalCliConfig()

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
  env: 'development',
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
  }
}

const buildParams = (type, overrides) => {
  return deepMerge(get(args, [ type, 'params']), overrides)
}

const { tagFromVariables } = require('../tagFromVariables')

describe('tagFromVariables', () => {

  beforeEach(() => {
    getRepoGitTagMock.mockClear()
  })

  afterAll(() => jest.resetAllMocks())

  it('should return a dynamic tag base on passed in params', async () => {

    const baseResp = await tagFromVariables(
      ['commit:version'],
      `base-version`,
      `test-base-env`,
      args.base,
    )
    expect(baseResp[0]).toBe(`${gitTagHash}-base-version`)

    const coreResp = await tagFromVariables(
      ['env:branch'],
      `base-version`,
      `test-core-env`,
      args.core,
    )
    expect(coreResp[0]).toBe(`test-core-env-git-test-branch`)

  })

})