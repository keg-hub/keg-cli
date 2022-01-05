const containers = require('./containers')
const { KEG_ENVS } = require('../envs')

const {
  images,
  containersPath,
} = require('./values')

const DOCKER = {
  ...require('./domainEnvs'),
  IMAGES: images,
  CONTAINERS_PATH: containersPath,
  KEG_PROXY_HOST: KEG_ENVS.KEG_PROXY_HOST,
  KEG_DOCKER_NETWORK: KEG_ENVS.KEG_DOCKER_NETWORK,
}

// Add the CONTAINERS property, with a get function do it only get called when referenced
Object.defineProperty(DOCKER, 'CONTAINERS', { get: () => containers.CONTAINERS, enumerable: true })

module.exports = { DOCKER }