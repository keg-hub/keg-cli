
/**
 * Convert port response from docker cli to json object
 * @function
 * @param {string} data - Output of a docker command as a string
 *
 * @returns {Object} - Formatted docker output as an object
 */
const portToJson = (data, port) => {
  return port
    ? { [ parseInt(data.split(':')[1]) ]: parseInt(port) }
    : data.split('\n')
      .reduce((items, item) => {
        if(!item.trim()) return items
      
        const [ contPort, localPort ] = item.split(' -> ')
        items[ parseInt(localPort.split(':')[1]) ] = parseInt(contPort)

        return items

      }, {})

}

module.exports = {
  portToJson
}