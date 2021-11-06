const { limbo } = require('@keg-hub/jsutils')

/**
 * Wraps a method with a callback into a promise
 * @function
 * @param {*} cb - method to wrap in a promise
 * @param {*} args - Arguments to pass to the callback method
 *
 * @returns {Promise|*} - Success response of fs.rename method
 */
 const limboify = (cb, ...args) => {
  return limbo(
    new Promise((res, rej) =>
      cb(...args, (err, success) => (err ? rej(err) : res(success || true)))
    )
  )
}

module.exports = {
  limboify
}
