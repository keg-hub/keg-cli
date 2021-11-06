const { inspect } = require('../cmds/inspect')

/**
 * Calls docker container inspect, on the passed in item container reference
 * @function
 * @param {Object} args - Arguments used to modify the docker api call
 * @param {string} args.item - Container reference
 * @param {string} args.container - Container reference
 * @param {string} args.containerRef - Container reference
 * @param {string} args.format - Format of the docker command output
 *
 * @returns {*} - Response from the docker command
 */
 const inspectContainer = async ({ item, container, containerRef, ...cmdArgs }) => {
  return await inspect({
    format: 'json',
    ...cmdArgs,
    type: 'container',
    item: item || container || containerRef,
  })
}

module.exports = {
  inspect: inspectContainer
}