const { get } = require('@keg-hub/jsutils')
const { cliStore } = require('@keg-hub/cli-utils')
const { throwMissingContext } = require('../error/throwMissingContext')
/**
 * Gets the cached context from the cliStore
 * @param {Object} args - arguments passed to the service
 * @param {Object} args.params - Params passed to the service
 *
 * @returns {Object} - Cached cliStore context
 */
const getServiceContext = ({ params }) => {
  const context = get(params, 'tap', get(params, 'context'))
  const contextData = cliStore.context.get(`${context}-context`)

  return contextData || throwMissingContext(context)
}

module.exports = {
  getServiceContext
}