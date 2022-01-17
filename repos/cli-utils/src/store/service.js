const { Logger } = require('../logger')
const {
  exists,
  isFunc,
  noOpObj,
  pipeline,
} = require('@keg-hub/jsutils')


/**
 * Wraps the passed in service method based on options and existing defined services
 * @param {function} service - Service function to wrap
 * @param {Object} options - Setting for how the service will be wrapped
 * @param {function} existing - Existing service of the same name
 * @param {Object} parentData - Metadata from the parent store
 *
 * @returns {function} - Wrapped service function 
 */
const serviceWrap = (service, options, existing, parentData) => {
  const { services, contexts, globalOpts } = parentData

  const wrapped = (...args) => service(
    ...args,
    services,
    contexts,
    globalOpts,
  )

  const { merge, pipe } = options

  return !merge && !pipe
    ? wrapped
    : pipe
      ? (...args) => pipeline(undefined, () => existing(...args), resp => wrapped(resp, ...args))
      : (...args) => {
          existing(...args)
          wrapped(...args)
        }
}


/**
 * Class for interacting with store service methods
 * @param {Object} parentData - Metadata from the parent store
 *
 * @returns {Object} - Service class instance
 */
class Service {

  #parentData = {}

  constructor(parentData){
    this.#parentData = parentData
  }

  /**
   * Sets a service so it can be accessed later
   * @param {string} name - Name of the service to set
   * @param {function} service - Service function to wrap
   * @param {Object} options - Setting for how the service will be wrapped
   *
   * @returns {void}
   */
  set(name, service, options=noOpObj){
    if(!name)
      throw new Error(`Setting a service requires a name for the service`)

    if(!isFunc(service))
      throw new Error(`The service must be of type "function"`)

    const { merge, override, pipe } = options

    if(exists(this.#parentData.services[name]) && !merge && !override && !pipe)
      throw new Error(`The service ${name} already exists, and neither merge, override, or pipe options exist`)

    this.#parentData.services[name] = serviceWrap(
      service,
      options,
      this.#parentData.services[name],
      this.#parentData
    )
  }

  /**
   * Gets a service from the cached parent services object
   * @param {string} name - Name of the service to set
   * @param {boolean} log - Log a warning if the service can not be found
   *
   * @returns {function} - Found service function 
   */
  get(name, log=true){
    if(isFunc(this.#parentData.services[name]))
      return this.#parentData.services[name]

    log && Logger.warn(`The service ${name} does not exist`)
  }

  /**
   * Clears a service from the cached parent services object
   * @param {string} name - Name of the service to clear
   *
   * @returns {void}
   */
  clear(name){
    this.#parentData.services[name] = undefined
  }
}

module.exports = {
  Service
}