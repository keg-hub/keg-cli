const homeDir = require('os').homedir();

const coreEnvs = {
  KEG_PATH: `${homeDir}/keg-hub`,
  CLI_PATH: `${homeDir}/keg-hub/repos/keg-cli`,
  CORE_PATH: `${homeDir}/keg-hub/repos/keg-core`,
  COMPONENTS_PATH: `${homeDir}/keg-hub/repos/keg-components`,
  RESOLVER_PATH: `${homeDir}/keg-hub/repos/tap-resolver`,
  PROXY_PATH: `${homeDir}/keg-hub/repos/keg-proxy`,
  JSUTILS_PATH: `${homeDir}/keg-hub/repos/jsutils`,
  KEG_CONTEXT_PATH: `${homeDir}/keg-hub/repos/keg-core`,
  KEG_DOCKER_FILE: `${homeDir}/keg-hub/repos/keg-core/container/Dockerfile`,
  KEG_VALUES_FILE: `${homeDir}/keg-hub/repos/keg-core/container/values.yml`,
  KEG_MUTAGEN_FILE: `${homeDir}/keg-hub/repos/keg-core/container/mutagen.yml`,
  KEG_COMPOSE_DEFAULT: `${homeDir}/keg-hub/repos/keg-core/container/docker-compose.yml`,
  KEG_EXEC_CMD: `tap:start`,
  KEG_BASE_IMAGE: `ghcr.io/keghub/keg-base:develop`,
  KEG_IMAGE_FROM: `ghcr.io/keghub/keg-core:develop`,
  DOC_APP_PATH: `/keg/keg-core`,
  DOC_BUILD_PATH: `/keg/core-build`,
  DOC_CLI_PATH: '/keg/keg-cli',
  DOC_CORE_PATH: '/keg/keg-core',
  DOC_COMPONENTS_PATH: `/keg/keg-core/node_modules/@keg-hub/keg-components`,
  DOC_JSUTILS_PATH: `/keg/keg-core/node_modules/@keg-hub/jsutils`,
  DOC_RETHEME_PATH: `/keg/keg-core/node_modules/@keg-hub/re-theme`,
  DOC_RESOLVER_PATH: '/keg/keg-core/node_modules/@keg-hub/tap-resolver',
  KEG_PROXY_PORT: 19006,
  IMAGE: `keg-core`,
  VERSION: `1.0.0`,
  CONTAINER_NAME: `keg-core`,
  CHOKIDAR_USEPOLLING: 1,
  KEG_COMPOSE_SERVICE: 'keg-core',
  DOCKER_HOST: 'unix:///var/run/docker.sock',
  KEG_DOCKER_IP: '0.0.0.0',
  KEG_DOCKER_BROADCAST: '0.0.0.0',
  KEG_DOCKER_SUBNET_MASK: '255.255.255.0',
  KEG_DOCKER_NAME: 'docker-keg',
  EXPO_CLI_VERSION: '5.0.3',
  EXPO_DEBUG_PORT: 19007,
  EXPO_APP_PORT: '19006',
  GIT_KEY: 'INITIAL',
  GIT_CLI_URL: 'https://github.com/keghub/.git',
  GIT_CORE_URL: 'https://github.com/keghub/.git',
  GIT_COMPONENTS_URL: 'https://github.com/keghub/.git',
  GIT_RESOLVER_URL: 'https://github.com/keghub/.git',
  GIT_PROXY_URL: 'https://github.com/keghub/.git',
  KEG_NODE_VERSION: '14.17-alpine',
  KEG_PROXY_PORT: 19006,
  KEG_PROXY_HOST: 'core.local.kegdev.xyz',
  KEG_PROXY_ENTRY: 'keg',
  DOCKER_BUILDKIT: 1,
  COMPOSE_DOCKER_CLI_BUILD: 1,
  PUBLIC_GIT_KEY: 'N/A',
  NODE_ENV: 'development',
  KEG_COPY_LOCAL: true,
}

const coreInject = {
  ARGS: {
    GIT_KEY: 'GIT_KEY',
    GIT_CLI_URL: 'GIT_CLI_URL'
  },
  DEFAULTS: {
    clean: true,
    connect: true,
    entrypoint: false,
    file: true,
    nocache: false,
  },
  VALUES: {
    file: `-f `,
    clean: '--rm',
    nocache: '--no-cache',
    entrypoint: '--entrypoint',
    connect: '-it'
  },
  ENV: coreEnvs,
  BUILD_ARGS_FILTER: [],
}


const injectCore = () => {
  const { DOCKER } = require('KegConst/docker')
  const withInjected = {
    ...DOCKER.CONTAINERS,
    CORE: coreInject,
  }
  jest.setMock('KegConst/docker', { DOCKER: { ...DOCKER, CONTAINERS: withInjected }})
}

module.exports = {
  coreEnvs,
  coreInject,
  injectCore,
}