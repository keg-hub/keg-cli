const path = require('path')
const { deepMerge } = require('@keg-hub/jsutils')
const { constants } = require('@keg-hub/cli-utils')
const packageJson = require('KegRoot/package.json')
const cliJson = require('KegRoot/scripts/setup/cli.config.json')
const homeDir = require('os').homedir()

const { CLI_ROOT, GLOBAL_CONFIG_FOLDER } = constants
const kegHub = path.join(homeDir, '/keg-hub')
const kegRepos = path.join(kegHub, 'repos')
const kegTaps = path.join(kegHub, 'taps')

const defPaths = {
  cli: CLI_ROOT,
  containers: path.join(kegRepos, 'keg-cli/containers'),
  core: path.join(kegRepos, 'keg-core'),
  hub: kegHub,
  keg: kegHub,
  config: GLOBAL_CONFIG_FOLDER,
  repos: kegRepos,
  jsutils: path.join(kegRepos, 'jsutils'),
  resolver: path.join(kegRepos, 'tap-resolver'),
  taps: kegTaps,
}

const defRepos = {
  hub: 'keg-hub',
  rc: 'tap-release-client',
}

/**
 * Builds the keg repo paths on the local machine
 * @param {Object} paths - Custom paths to keg repos
 *
 * @returns {Object} - Custom paths to repos joined with defaults
 */
const buildInstallPaths = (paths={}) => {
  return Object.keys(defPaths)
    .reduce((usePaths, key) => {
      return key === 'cli' || key === `keg`
        ? usePaths
        : { ...usePaths, [key]: paths[key] || defPaths[key] }
    }, {})
}

/**
 * Builds the default global config from the package.json and the cli.json
 * Merges the two together, and returns it
 *
 * @returns {Object} - Default global config
 */
const defaultConfig = (args={}) => {
  return deepMerge({
    version: packageJson.version,
    name: packageJson.name,
    cli: {
      paths: buildInstallPaths(args.paths || {})
    }
  }, cliJson)
}


module.exports = {
  defaultConfig,
  defPaths,
  defRepos,
}
