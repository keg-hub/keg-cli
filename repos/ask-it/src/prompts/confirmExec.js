const { checkCall, noPropArr } = require('@keg-hub/jsutils')
const { confirm:askConfirm } = require('./confirm')

/**
 * Confirms that a tasks should be preformed, then executes it when true
 * @function
 * @param {Object} args - Items to check and perform a task
 * @param {function} args.execute - Task for be preformed
 * @param {boolean} args.force - if true, bypasses confirm step and proceeds as if user confirmed
 * @param {string} args.confirm - Message to print when confirming the task
 * @param {boolean} args.preConfirm - True if the action has already been confirmed
 * @param {string} args.cancel - Message to print when the task was canceled
 * @param {Array} args.args - Extra arguments to pass to the task being performed
 *
 * @returns {void}
 */
const confirmExec = async params => {
  const {
    force,
    cancel,
    execute,
    success,
    confirm,
    preConfirm,
    args=noPropArr
  } = params

  const confirmed = force || preConfirm === true
     ? true
     : await askConfirm(confirm)

  if(!confirmed)
    return console.warn(cancel) || console.log()
  
  const response = await checkCall(execute, ...args)

  success && console.log(`\n{success}`)
  console.log()

  return response

}

module.exports = {
  confirmExec,
}