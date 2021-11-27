const path = require('path')
const homeDir = require('os').homedir()
const { deepFreeze, get } = require('@keg-hub/jsutils')
const { tryRequireSync } = require('@keg-hub/jsutils/src/node')

const { KEG_GLOBAL_CONFIG } = process.env

// The default global config path and config file
let GLOBAL_CONFIG_FOLDER = path.join(homeDir, '.kegConfig')
let GLOBAL_CONFIG_FILE = 'cli.config.json'

// If the global config path is passed in as an ENV, use that instead
if (KEG_GLOBAL_CONFIG) {
  const configPathSplit = KEG_GLOBAL_CONFIG.split('/')
  GLOBAL_CONFIG_FILE = configPathSplit.pop()
  GLOBAL_CONFIG_FOLDER = configPathSplit.join('/')
}

const GLOBAL_INJECT_FOLDER = path.join(GLOBAL_CONFIG_FOLDER, '.tmp')

/**
 * Environment keys mapped to their shortcuts
 * @array
 */
 const ENV_MAP = {
  PRODUCTION: [ 'production', 'prod', 'p' ],
  CI: [ 'ci', 'c' ],
  QA: [ 'qa', 'q' ],
  STAGING: [ 'staging', 'st', 's' ],
  DEVELOPMENT: [ 'development', 'dev', 'd' ],
  LOCAL: [ 'local', 'loc', 'l' ],
  TEST: [ 'test', 'tst', 't' ]
}

/**
 * All env shortcuts mapped to a single array
 * @array
 */
 const ENV_OPTIONS = Object.entries(ENV_MAP)
 .reduce((options, [ main, shortcuts ]) => {
   return options.concat(shortcuts)
 }, [])

 /**
 * Finds the keg-cli directory based on env, parent module or keg-cli global config
 *
 * @return {string} - Directory of the keg-cli on the host machine
 */
 const getKegCliPath = () => {
   if(process.env.KEG_CLI_PATH) return process.env.KEG_CLI_PATH

  // If this file was required by the cli entry point, then use it's directory path
  if(path.basename(require.main.filename) === `keg-cli.js`)
    return require.main.path

   const globalConfig = tryRequireSync(path.join(GLOBAL_CONFIG_FOLDER, GLOBAL_CONFIG_FILE))
   return get(globalConfig, `cli.paths.cli`)

 }

module.exports = deepFreeze({
  // Cache the root of the CLI for other file to reference
  // All other references to cli root should come from here
  CLI_ROOT: getKegCliPath(),

  // --- DOCKER Constants --- //
  // Should be moved to docker-lib
  // Container context helpers
  // Mapped prefixes for some tasks that add prefixes when running containers
  CONTAINER_PREFIXES: {
    PACKAGE: 'package',
    IMAGE: 'img',
  },

  // Keg Default .env file, stored in ~/.kegConfig folder
  DEFAULT_ENV: `defaults.env`,
  
  // Global config paths
  GLOBAL_CONFIG_FOLDER,
  GLOBAL_CONFIG_FILE,
  GLOBAL_INJECT_FOLDER,

  // Global config settings
  GLOBAL_CONFIG_PATHS: {
    CLI: 'cli',
    CLI_PATHS: 'cli.paths',
    GIT: 'cli.git',
    TAPS: `cli.taps`,
    TAP_LINKS: `cli.taps`,
    SETTINGS: 'cli.settings',
    EDITOR_CMD: 'cli.settings.editorCmd'
  },

  // Environment keys mapped to their shortcuts 
  ENV_MAP,
  // ALL Environment keys as an array
  ENV_OPTIONS,
  // Shortcuts to map env to real environment
  ENV_ALIAS: [ 'environment', 'env', 'e' ],

  // Help options. when one is passed as an option, the help menu is printed
  HELP_ARGS: [
    'help',
    '-help',
    '--help',
    'h',
    '-h',
    '--h',
  ],

  // private ranges of ip addresses
  PRIVATE_IPV4_CLASSES: {
    A: [ '10.0.0.0', '10.255.255.255' ],
    B: [ '172.16.0.0', '172.31.255.255' ],
    C: [ '192.168.0.0', '192.168.255.255' ],
  },

  // all supported tap config names
  TAP_CONFIG_NAMES: [
    'tap.config.js',
    'tap.js',
    'tap.config.json',
    'tap.json',
    'app.config.js',
    'app.js',
    'app.config.json',
    'app.json',
    'package.json',
  ],

  // Tasks settings
  TASK_REQUIRED: [
    'prefix',
    'name',
    'action',
    'description'
  ],

  SEMVER_TYPES: [
    'major',
    'minor',
    'patch',
    'meta',
  ],

})
