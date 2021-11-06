const { checkCall } = require('@keg-hub/jsutils')
const { list } = require('./list')

/**
 * Gets a container object from the list of container returned from the list command
 * 
 */
 const getContainer = async nameOrId => {
  // Get all current containers
  const containers = await list({ errResponse: [], format: 'json' })

  return containers.reduce((item, container) => {
    return item 
      ? item
      : checkCall(() => {
          let match = container.name === nameOrId || container.id === nameOrId
          match = match || container.name.indexOf(`-${ nameOrId }`) === 0

          return match ? container : item
        })
  }, false)
}

module.exports = {
  getContainer,
  get: getContainer,
}