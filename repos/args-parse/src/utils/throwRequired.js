const logPair = (first, second) => console.log(first + ' \033[0;36m' + second + '\033[0m')

const wrapRed = text => ("\033[0;31m" + text + "\033[0m")

const wrapYellow = text => ("\033[1;33m" + text + "\033[0m")

/**
 * Formats and throws an error when a required argument is not included
 * @param {Object} task - Current task being run
 * @param {string} key - Name of the argument that's required
 * @param {Object} meta - Information about the missing required argument
 * @param {boolean} skipTaskFailed - Should the throwTaskFailed call be skipped
 *
 * @returns {void}
 */
const throwRequired = (task, key, meta={}) => {
  // Try catch the thrown error to get the stack trace.
  try {
    throw new Error()
  }
  catch(err){
    console.log(``)
    console.log(wrapRed(`Task failed!`))
    console.log(``)
    console.log(
      "Task "
      + wrapYellow(task.name)
      + " " + (meta.require || meta.required ? 'requires' : 'enforces a') + " " 
      + wrapYellow(key)
      +" argument."
    )

    meta.alias && logPair(`  * Alias:`, [ key[0] ].concat(meta.alias).join(' | '))
    meta.description && logPair(`  * Description:`, meta.description)
    meta.allowed && logPair(`  * Allowed Values:`, meta.allowed.join(' | '))
    meta.example && logPair(`  * Example:`, meta.example)
    console.log(``)

    console.error(err.stack)
    console.log(``)
    process.exit(1)
  }

}

module.exports = {
  throwRequired
}
