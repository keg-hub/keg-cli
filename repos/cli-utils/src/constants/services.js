const { deepFreeze } = require('@keg-hub/jsutils')

module.exports = deepFreeze({
  DOC_ENV_CONTEXT_SRV: `docker-env-context-service`,
  TAP_TASK_SRV: `tap-task-service`,
  TAP_LOCATIONS_SRV: `tap-locations-service`,
  DOC_IMG_NAME_CONTEXT: `docker-img-name-context`
})