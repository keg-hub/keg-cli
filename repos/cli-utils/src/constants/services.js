const { deepFreeze } = require('@keg-hub/jsutils')

module.exports = deepFreeze({
  // @keg-hub/docker-lib
  // - Services
  DOC_ENV_CONTEXT_SRV: `docker-env-context-service`,
  // - Contexts
  DOC_IMG_NAME_CONTEXT: `docker-img-name-context`,

  // @keg-hub/services-lib
  // - Services
  TAP_COMPOSE_SRV: `tap-compose-service`,
  TAP_LOCATIONS_SRV: `tap-locations-service`,
  TAP_PROXY_SRV: `tap-proxy-service`,
  TAP_PULL_SRV: `tap-pull-service`,
  TAP_START_SRV: `tap-start-service`,
  TAP_TASK_SRV: `tap-task-service`,

})