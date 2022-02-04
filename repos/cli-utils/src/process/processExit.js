/** @module Process */

const { Logger } = require('../logger/logger')
const { exists, isNum, noOpObj } = require('@keg-hub/jsutils')

let eventExitStatus = noOpObj

/**
 * Returns the status of eventExitStatus
 * @function
 * @public
 *
 * @returns {number} eventExitStatus - The error code returned from a child process
 */
const getEventExitCode = () => {
  return eventExitStatus
}

/**
 * Error handler called when npm test command fails
 * @function
 * @public
 * @exits
 * @param {number} exitCode - The error code returned from the npm test command
 * @param {string} tag - Tag for the logged message
 * @param {string} message - Error message to display
 *
 */
const onProcessExit = (tag, exitCode, message) => {
  tag &&
    message &&
    Logger.error(`\n[ ${tag} ] - ${message}\n`)

  process.exit(exitCode)
}

/**
 * Helper to automatically add exit listeners to the current process
 * Allows exiting the process in the middle of the task being run
 * @function
 * @private
 *
 * @returns {void}
 */
 const addExitEvents = () => {
  Array.from([
    'exit',
    'SIGINT',
    'SIGUSR1',
    'SIGUSR2',
    'uncaughtException',
    'SIGTERM'
  ])
    .map(event => process.on(event, (type, exitCode) => {
      !exists(eventExitStatus.code) &&
        (eventExitStatus = {
          code: isNum(type) ? type : exitCode,
          message: `Process exit from event: ${event}`,
        })
    }))
 }
 
 
 module.exports = {
  addExitEvents,
  onProcessExit,
  getEventExitCode,
 }