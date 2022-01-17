const {
  exists,
  noOpObj,
  deepMerge,
  deepFreeze,
} = require('@keg-hub/jsutils')


/**
 * Class for interacting with store context objects
 * @param {Object} parentData - Metadata from the parent store
 *
 * @returns {Object} - Context class instance
 */
class Context {

  #parentData = {}

  constructor(parentData){
    this.#parentData = parentData
  }

  /**
   * Sets a context object so it can be accessed later
   * @param {string} name - Name of the context to set
   * @param {*} context - Data to store as the context
   * @param {Object} options - Setting for how the context will be stored
   *
   * @returns {void}
   */
  set(name, context, options=noOpObj){
    if(!name)
      throw new Error(`Setting a context requires a name for the context`)
    
    if(!exists(context))
      throw new Error(`Setting a context requires the context value exists`)

    const { merge, override } = options


    if(exists(this.#parentData.contexts[name]) && !merge && !override)
      throw new Error(`The context ${name} already exists, and neither merge or override options exist`)
    
    this.#parentData.contexts[name] = deepFreeze(
      merge
      ? deepMerge(this.#parentData.contexts[name], context)
      : context
    )

    return this.#parentData.contexts[name]
  }

  /**
   * Gets a context from the cached parent context object
   * @param {string} name - Name of the context to set
   *
   * @returns {function} - Found service function 
   */
  get(name){
    return this.#parentData.contexts[name]
  }

  /**
   * Clears a context from the cached parent contexts object
   * @param {string} name - Name of the context to clear
   *
   * @returns {void}
   */
  clear(name){
    this.#parentData.contexts[name] = undefined
  }
}

module.exports = {
  Context
}