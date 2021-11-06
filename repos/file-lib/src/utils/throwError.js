const { isStr } = require('@keg-hub/jsutils')

/**
 * Throws an error with the passed in err message or object
 * @param {Object|string} err - Error or message to be thrown
 * @throws
 *
 */
const throwError = err => {
  const toThrow = isStr(err) ? new Error(err) : err
  throw toThrow
}

module.exports = {
  throwError
}