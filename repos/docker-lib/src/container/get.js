const { checkCall } = require('@keg-hub/jsutils')
const { list } = require('./list')
const { formatParams } = require('../utils/formatParams')


/**
 * Gets a container object from the list of container returned from the list command
 * @param {Object|string} containerRef - Reference of the container to get
 * 
 * @returns {Object|boolean} - Found container or false
 */
 const getContainer = async containerRef => {
  const { container } = formatParams(`container`, containerRef)
  
  // Get all current containers
  const containers = await list({ errResponse: [], format: 'json' })

  return containers.reduce((item, cont) => {
    return item 
      ? item
      : checkCall(() => {
          let match = cont.name === container || cont.id === container
          match = match || cont.name.indexOf(`-${ container }`) === 0

          return match ? cont : item
        })
  }, false)
}

module.exports = {
  getContainer,
  get: getContainer,
}