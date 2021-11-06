const { list } = require('./list')
const { isArr } = require('@keg-hub/jsutils')
const { compareItems } = require('../utils/compareItems')


/**
 * Checks if an container already exists ( is built )
 * @function
 * @param {string} compare - Value to compare each container with
 * @param {string|function} doCompare - How to compare each container
 *
 * @returns {boolean} - Based on if the container exists
 */
const exists = async (compare, doCompare) => {
  compare = isArr(compare) ? compare : [ compare ]

  // Get all current containers
  const containers = await list({ errResponse: [], format: 'json' })

  const found = containers &&
    containers.length &&
    compare.map(cont => {
      // If we have containers, try to find the one matching the passed in argument
      return containers.some(container => compareItems(
        container,
        compare,
        doCompare,
        [ 'id', 'name' ]
      ))

    })

  return found && found.indexOf(false) === -1
    ? found[0]
    : false

}

module.exports = {
  exists
}