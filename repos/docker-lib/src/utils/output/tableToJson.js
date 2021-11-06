const { camelCase } = require('@keg-hub/jsutils')

const SPACE_MATCH = / [ ]+/
const NEWLINES_MATCH = /\n|\r|\r\n/

/**
 * Formats the docker table output into an object
 * @function
 * @param {string} data - Output of a docker command in table format 
 *
 * @returns {Object} - Formatted docker output as an object
 */
 const tableToJson = data => {
  const lines = data.toLowerCase().split(NEWLINES_MATCH)
  const headers = lines.shift().split(SPACE_MATCH)

  return lines.reduce((mapped, line) => {
    return !line.trim()
      ? mapped
      : mapped.concat([
          line
            .split(SPACE_MATCH)
            .reduce((item, content, index) => {
              const key = headers[index]
              item[camelCase(key)] = content

              return item
            }, {})
        ])

  }, [])
}

module.exports = {
  tableToJson
}