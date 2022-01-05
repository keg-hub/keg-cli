

/**
 * Logs a header and error message when called
 * Will exit the current process if last argument is greater then 0
 * @param {Object} err - Error that was thrown
 * @param {string} header - Error header message
 * @param {number} exit - Exit code for the process. If exit if greater then 0
 * 
 * @returns {void}
 */
const setupError = (err, header, exit) => {
  console.log('\n')
  header && console.error(`[Keg-CLI ERROR] ${header}`)
  err && err.stack && console.log(err.stack)
  console.log('\n')

  exit && process.exit(exit)
}

module.exports = {
  setupError
}