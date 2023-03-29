/** @module Task */

const { HELP_ARGS } = require('../constants')

/**
 * Finds the correct task definition relative to the options
 * @function
 * @param {string} arg - Value to check if it match a help arg type
 *
 * @returns {boolan} - True if the args include a help arg
 */
const hasHelpArg = (arg) => (HELP_ARGS.includes(arg))

module.exports = {
  hasHelpArg
}
