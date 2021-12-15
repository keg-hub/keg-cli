const { getKegGlobalConfig } = require('@keg-hub/cli-utils')
const { getRepoPath } = require('KegUtils/getters/getRepoPath')
const { constants, getDefaultEnv } = require('@keg-hub/cli-utils')

const { CLI_ROOT, GLOBAL_CONFIG_FOLDER } = constants

/*
 * Adds extra data to the object passed to the template fill function
 * <br/>Used when filling the values.yml || .env files
 * @function
 * @param {string} container - Name of the container to build the config for
 *
 * @returns {Object} - Loaded ENVs for the current environment
*/
const buildTemplateData = ({ container, env, envs, globalConfig, __internal={} }) => {

  const { injectPath, context, ...internal } = __internal
  globalConfig = globalConfig || getKegGlobalConfig()

  return {
    envs,
    container,
    cliPath: CLI_ROOT,
    context: context || container,
    env: env || getDefaultEnv(),
    globalConfigPath: GLOBAL_CONFIG_FOLDER,
    ...internal,
    cli: globalConfig.cli,
    docker: globalConfig.docker,
    publish: globalConfig.publish,
    contextPath: injectPath || getRepoPath(context || container),
  }
}

module.exports = {
  buildTemplateData
}