const path = require('path')
const homeDir = require('os').homedir()
const { deepFreeze } = require('@keg-hub/jsutils')
const { constants } = require('@keg-hub/cli-utils')


module.exports = deepFreeze({
  ...constants,

  // --- GIT Constants --- //
  // TODO: Should be moved to git-lib
  // Path to the git ssh key
  GIT_SSH_KEY_PATH: path.join(homeDir, '.ssh/github'),
  GIT_SSH_COMMAND: "ssh",
  GIT_SSH_KEY: '-i {{ GIT_KEY_PATH }}',
  GIT_SSH_PARAMS: [
    '-o BatchMode=yes',
    '-o UserKnownHostsFile=/dev/null',
    '-o StrictHostKeyChecking=no'
  ],

  // --- CONTAINER Constants --- //
  // TODO: Should be remove once all containers are taps
  CONTEXT_TO_CONTAINER: {
    base: 'keg-base',
    proxy: 'keg-proxy',
  },

  // TODO: Should be remove once all containers are taps
  // Map shortcuts and variations between the container cmdContext and the container
  CONTAINER_TO_CONTEXT: {
    kegbase: 'base',
    'keg-base': 'base',
    kegproxy: 'proxy',
    'keg-proxy': 'proxy',
  },

  // docker exec constants and options for the utils/services/composeService.js
  KEG_DOCKER_EXEC: 'KEG_DOCKER_EXEC',
  KEG_EXEC_OPTS: {
    start: 'compose-start',
    packageRun: 'package-run',
    dockerExec: 'docker-exec',
  },

})
