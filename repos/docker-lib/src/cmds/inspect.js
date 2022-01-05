const { dockerCli } = require('./dockerCli')
const { noItemError } = require('../utils/error/noItemError')
const { invalidInspectError } = require('../utils/error/invalidInspectError')

const {
  isArr,
  isColl,
  isObj,
  isStr,
  exists,
} = require('@keg-hub/jsutils')

/**
 * Runs docker inspect for the passed in item reference
 * @function
 * @param {Object|string} args - Arguments to pass to the docker image command
 * @param {string} args.item - Reference to the docker item
 * @param {boolean} args.parse - Should parse the response into JSON
 * @param {string} [args.format=json] - Format the returned results
 * @param {boolean} [args.skipError=false] - Should skip throwing an error
 * @param {boolean} [args.log=false] - Should log docker commands as the are run
 *
 * @returns {string|Object} - Docker inspect meta data
 */
 const inspect = async args => {
  // Ensure the args are an object
  const { item, ...toInspect } = isStr(args) ? { item: args, format: 'json' } : args

  // Extract the item based on it's format
  const itemRef = isObj(item) && (item.id || item.rootId || item.name)
    ? item.id || item.rootId || item.name
    : isStr(item) && item

  // Ensure we have an item to inspect
  !itemRef &&
    !args.skipError && 
    noItemError(`docker.inspect`)

  // Build the command, and add format if needed
  const cmdToRun = [ `inspect`, itemRef ]
  toInspect.type && cmdToRun.unshift(toInspect.type)

  // Call the docker inspect command
  const inspectData = await dockerCli({
    opts: cmdToRun,
    format: exists(toInspect.format) ? toInspect.format : 'json',
    log: exists(toInspect.log) ? toInspect.log : false,
  })

  // Check if the response should be parsed
  const parse = exists(toInspect.parse) ? toInspect.parse : true

  // If no parsing, or it's already a collection, just return it
  if(!parse || isColl(inspectData))
    return isArr(inspectData) ? inspectData[0] : inspectData

  try {

    // Parse the data, and return the first found item
    const parsed = JSON.parse(inspectData)
    return isArr(parsed)
      ? parsed[0]
      : isObj(parsed)
        ? parsed
        : invalidInspectError(parsed)
  }
  catch(error){
    return args.skipError
      ? inspectData
      : invalidInspectError(inspectData, error)
  }

}

module.exports = {
  inspect
}