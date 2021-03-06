const globalConfig = global.getGlobalCliConfig()
const path = require('path')
const { DOCKER } = require('KegConst/docker')
const { getTask } = require('KegMocks/helpers/testTasks')
const { deepMerge, get } = require('@keg-hub/jsutils')
const { coreEnvs } = require('KegMocks/injected/injectedCore')
const { allowedTagOpts } = require('../../../getters/getTagVarMap')
const { containerContexts } = require('KegMocks/contexts/containerContexts')

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

const { tagFromVersion } = require('../tagFromVersion')

describe('tagFromVersion', () => {

  afterAll(() => jest.resetAllMocks())

  it('should the version from the params when passed', async () => {

    const baseVer = await tagFromVersion(buildParams('base', { version: 'base-version' }), args.base)
    expect(baseVer).toBe('base-version')

    const coreVer = await tagFromVersion(buildParams('core', { version: 'core-version' }), args.core)
    expect(coreVer).toBe('core-version')

  })

  it('should return the version from ENVs when no param or package.json version', async () => {

    const baseVer = await tagFromVersion(args.base.params, args.base)
    expect(baseVer).toBe(DOCKER.CONTAINERS.BASE.ENV.VERSION)

    const coreVer = await tagFromVersion(args.core.params, args.core)
    expect(coreVer).toBe(coreEnvs.VERSION)

  })

  it('should return the version from package.json when tagPackage is true', async () => {
    const tagPackage = true
    // Override the default core context location to be the keg-cli root dir
    // That way we can ensure the package.json exists
    const orgContext = args.core.containerContext.contextEnvs.KEG_CONTEXT_PATH
    const rootPath = path.join(__dirname, '../../../../../')
    const rootPackage = require(path.join(rootPath, 'package.json'))
    args.core.containerContext.contextEnvs.KEG_CONTEXT_PATH = rootPath

    const coreVer = await tagFromVersion(buildParams('core', { tagPackage }), args.core)
    expect(coreVer).toBe(rootPackage.version)

    args.core.containerContext.contextEnvs.KEG_CONTEXT_PATH = orgContext
  })

})