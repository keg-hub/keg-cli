const { isStr, isArr, isObj, noPropArr } = require('@keg-hub/jsutils')

/**
 * Converts an Array or string of labels in to an array of docker label arguments
 * @param {Array|string} labels - Labels to be converted
 * 
 * @param {Array} - Labels converted into docker format
 */
const toBuildLabels = labels => {
  const labelsArr = isStr(labels)
    ? labels.split(',')
    : isArr(labels)
      ? labels
      : isObj(labels)
        ? Object.entries(labels).map(([key,val]) => `${key}=${val}`)
        : noPropArr

  return labelsArr.reduce((acc, label) => {
    label
      .replace(/-l\s|--label\s/g, '')
      .split(' ')
      .filter(t => t.trim())
      .map(t => acc.push(`-l`, label.trim()))

    return acc
  }, [])
}

module.exports = {
  toBuildLabels,
}
