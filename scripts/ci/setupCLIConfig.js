#!/usr/bin/env node

/**
 * @summary - Sets up the required config files for the Keg-CLI
 *          - Saves config files to the host machine relative to the KEG_CONFIG_PATH env
 *
 * @example
 * GITHUB_TOKEN=12345 NODE_ENV=ci KEG_CUSTOM_PATH=../custom/config.json node ./scripts/ci/setupCLIConfig.js
 *
 * @envs
    * GITHUB_TOKEN - Token to allow interacting with the github API
    * KEG_CLI_PATH - Path to the Keg-CLI repo
      * If not set, will use the root folder relative to the file ( i.e. ../../ )
    * KEG_CONFIG_FILE - Name of the global config file to create
      * Default is cli.config.json
    * KEG_CONFIG_PATH - Folder Location where the cli config files should be saved
      * Default is <KEG_CLI_PATH env>/.kegConfig
    * NODE_ENV - Will be used as the default environment for the keg-cli
    * USER - (Optional) The docker user
 *
 * @returns {void}
*/


require('../cli/aliases')
const path = require('path')
const fs = require('fs-extra')
const ciConfig = require('./ci.config.json')
const { deepMerge } = require('@keg-hub/jsutils')

const {
  GITHUB_TOKEN,
  KEG_CLI_PATH=path.join(__dirname, '../../'),
  KEG_CONFIG_FILE=`cli.config.json`,
  KEG_CONFIG_PATH=path.join(KEG_CLI_PATH, '.kegConfig'),
  KEG_ROOT_DIR,
  NODE_ENV,
  USER="keg-admin",
} = process.env

const buildCIConfig = (customConfig) => {
  return deepMerge(ciConfig, {
    cli: {
      paths: {
        cli: KEG_CLI_PATH,
        containers: path.join(KEG_CLI_PATH, 'containers'),
        kegConfig: KEG_CONFIG_PATH,
        keg: KEG_ROOT_DIR,
        core: path.join(KEG_ROOT_DIR, 'repos', 'keg-core'),
      },
      git: {
        orgName: `keg-hub`,
        orgUrl: `https://github.com/keg-hub`,
        publicToken: GITHUB_TOKEN,
        key: GITHUB_TOKEN,
        user: USER,
        repos: {
          cli: `keg-cli`,
          hub: `keg-hub`,
        }
      },
      settings: {
        defaultEnv: NODE_ENV || ciConfig.cli.settings.defaultEnv,
      }
    },
    docker: {
      providerUrl: `ghcr.io`,
      namespace: `keg-hub`,
      user: USER,
      token: GITHUB_TOKEN
    },
  }, customConfig)
}


(async () => {

  // Ensure the global keg config folder path exists
  process.stdout.write(`::debug::Creating directory ${KEG_CONFIG_PATH}\n`)
  !fs.existsSync(KEG_CONFIG_PATH) && fs.mkdirSync(KEG_CONFIG_PATH)
 
  const ciENVFrom = path.join(__dirname, 'ci.env')
  const ciENVTo = path.join(KEG_CONFIG_PATH, 'defaults.env')

  // Copy over the CI defaults.env file
  process.stdout.write(`::debug::Creating ci.env file at path ${ciENVTo}\n`)
  fs.copySync(ciENVFrom, ciENVTo) 

  const globalConfig = buildCIConfig({})
  
  process.stdout.write(`::debug::Docker User is ${globalConfig.docker.user}\n`)
  process.stdout.write(`::debug::Default Env is ${globalConfig.cli.settings.defaultEnv}\n`)
  
  const ciConfigTo = path.join(KEG_CONFIG_PATH, KEG_CONFIG_FILE)

  // Build then wright the cli config file to the config path
  process.stdout.write(`::debug::Creating ci cli.config.json file at path ${ciConfigTo}\n`)
  fs.writeFileSync(
    ciConfigTo,
    JSON.stringify(globalConfig, null, 2),
    'utf8'
  )

  process.stdout.write(`::debug::Finished creating Keg-CLI config files!\n`)

})()