const path = require('path')
const { env } = require('@keg-hub/parse-config')
const { constants } = require('@keg-hub/cli-utils')
const { deepFreeze, reduceObj } = require('@keg-hub/jsutils')
const { CLI_ROOT } = constants

const envType = process.env.KEG_DOCKER_MACHINE
  ? `machine`
  : `desktop`

// Load the docker-machine ENVs from same file as setup script
const machineEnvs = env.loadSync({
  location: path.join(CLI_ROOT, `scripts/docker/docker-${envType}.env`),
})

/*
 * Builds the docker machine config
 *
 * @returns {Object} - Built machine config
*/
module.exports = deepFreeze({
  PREFIXED: machineEnvs,
  // Use the same ENV file as the setup script, but remove the KEG_DOCKER_ prefix
  DOMAIN_ENVS: reduceObj(machineEnvs, (key, value, cleaned) => {
    cleaned[key.replace('KEG_DOCKER_', '')] = value

    return cleaned
  }, {})
})