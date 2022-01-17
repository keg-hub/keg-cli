const { Service } = require('./service')
const { Context } = require('./context')
const { deepMerge } = require('@keg-hub/jsutils')

/**
 * Wrapper around the cliStore and external cache objects
 * Allows creating multiple instances if needed
 * @param {Object} options - Settings to add to the globalOptions object
 *
 * @returns {Object} - CLiStore class instance
 */
const CreateStore = function(options) {

  const parentData = {
      contexts: {},
      services: {},
      globalOpts: options
    }

  /**
  * Singleton class instance for managing cached contexts and services in the Keg-CLI
  * Helps with dependency management and caching responses from long running processes
  *
  * @returns {Object} - CLiStore class instance
  */
  class CliStore {
    
    constructor(){
      this.service = new Service(parentData)
      this.context = new Context(parentData)
    }

    /**
    * Sets a global options object
    * @param {Object} options - Settings to add to the globalOptions object
    * @param {boolean} merge - Should the options be merged with the current options
    *
    * @returns {void}
    */
    setGlobalOptions(options, merge=true){
      parentData.globalOpts = merge ? deepMerge(parentData.globalOpts, options) : options
    }

    /**
    * Gets a global options object
    *
    * @returns {Object} - Current global options object
    */
    getGlobalOptions(){
      return parentData.globalOpts
    }

    /**
    * Clears the entire store, services, contexts, and global options
    *
    * @returns {void}
    */
    clearStore(){
      parentData.contexts = {}
      parentData.services = {}
    }
  }

  return new CliStore()
}

module.exports = {
  CliStore: CreateStore,
  cliStore: new CreateStore({}),
}