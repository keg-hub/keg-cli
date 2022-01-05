const { apiError } = require('../error/apiError')
const {
  camelCase,
  checkCall,
  deepMerge,
  isArr,
  isStr,
  snakeCase,
  uniqArr,
} = require('@keg-hub/jsutils')

/**
 * Maps keys from the docker cli response to a different key value
 * @object
 */
 const CLI_KEY_MAP = {
  Names: 'name'
}


/**
 * Formats the docker json output into an object
 * Docker `--format json` flag gives a weird string json output
 * This helper cleans up the output, so it can be properly parsed as JSON
 * @function
 * @param {string} data - Output of a docker command in table format 
 *
 * @returns {Object} - Formatted docker output as an object
 */
 const asJson = (data, skipError) => {
  // Caches the index of an image ID within the built array
  // This allows us to check for duplicates and merge them to gether
  const indexMap = {}

  return data.split('\n')
    .reduce((items, item) => {
      if(!item.trim()) return items

      try {
        const parsed = JSON.parse(item.replace(/\\"/g, ''))
        const built = {}
        Object.keys(parsed).map(key => {
          // Check if there's an alt key to use instead of the default
          const useKey = CLI_KEY_MAP[key] || key
          built[camelCase(snakeCase(useKey))] = parsed[key]
        })

        built.tags = isArr(built.tags) ? built.tags : [ built.tag ]

      // Adds rootId key, which removes and docker repository content
      // This allows us to pull from a remote provider, and compare just the original image name
        if(built.repository)
          built.rootId = built.repository.indexOf('/') !== -1
            ? built.repository.split('/').pop()
            : built.repository
        else if(built.image && isStr(built.labels)){

          // Convert container labels from a string to an object
          built.labelsObj = built.labels.split(',')
            .reduce((labelObj, label) => {
              const [ key, value ] = label.split('=')
              key && value && (labelObj[key] = value)

              return labelObj
            }, {})

        }
        const existing = indexMap[built.id] && items[ indexMap[built.id] ]

        // De-dupes the returned images
        // And images the same id, get merged together
        return !existing
          ? checkCall(() => {
              indexMap[built.id] = items.length
              return items.concat([ built ])
            })
          : checkCall(() => {
              const merged = deepMerge(existing, built)
              merged.tags = uniqArr(merged.tags)
              items[ indexMap[built.id] ] = merged

              return items
            })

        return items.concat([ built ])
      }
      catch(err){
        return apiError(err, items, skipError)
      }

    }, [])
}

module.exports = {
  asJson
}