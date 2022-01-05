const { isFunc, isStr } = require('@keg-hub/jsutils')

/**
 * Compares the passed in item's keys with the compare argument
 * @function
 * @param {Object} item - Item to compare
 * @param {string} compare - Value to compare each item with
 * @param {string|function} doCompare - How to compare each container
 * @param {Array} defCompareKeys - If no doCompare is passed, use the default keys for compare
 *
 * @returns {Boolean} - If the compare values match
 */
 const compareItems = (item, compare, doCompare, defCompareKeys=[]) => {
  return isStr(doCompare)
    ? item[doCompare] === compare
    : isFunc(doCompare)
      ? doCompare(item, compare)
      : defCompareKeys.some(key => item[key] === compare)
}


module.exports = {
  compareItems
}