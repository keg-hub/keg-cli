/**
 * Throws an error with the passed in message
 * @function
 * @param {string} message - Message for the thrown error
 *
 * @returns {void}
 */
 const throwFailedCmd = (message=`Docker API command Failed!`) => {
  throw new Error(message)
}

module.exports = {
  throwFailedCmd
}