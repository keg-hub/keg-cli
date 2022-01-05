
/**
 * Checks if the passed in value is a valid short docker id
 * @function
 * @param {string} value - String to check if is a valid short docker id
 *
 * @returns {boolean} - If value is a valid short docker it
 */
 const isDockerId = toTest => {
  try {
    let parsed = parseInt(toTest, 16).toString(16)
    parsed = toTest[0] === '0' ? `0${parsed}` : parsed

    return Boolean(parsed === toTest) && toTest.length === 12
  }
  catch(err){
    return false
  }
} 

module.exports = {
  isDockerId
}