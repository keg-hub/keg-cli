const { get, isColl } = require('@keg-hub/jsutils')
const { colors } = require('./colors')


/**
 * State of the log tag
 * Disables logging the tag, even when it's set
 * @private
 * @type {Boolean}
 */
let TAG_DISABLED = false

/**
 * General logging method for all log types
 * @function
 * @private
 * @param {Object} logger - Log class instance
 * @param {string} type - Type of log ( key of Log.colorMap )
 *
 * @returns {Void}
 */
const logData = (logger, type) => {
  return (...args) => {
    // Get the log color from the type, or use the default
    const logColor = logger.colorMap[type] || logger.colorMap[logger.default]

    // If the type is a log type use it, otherwise use the default
    const logMethod = (console[type] && type) || logger.default

    // Loop the passed in data to log, and apply the log color
    const toLog = args.map(data => {
      return isColl(data)
        ? colors[logColor](JSON.stringify(data, null, 2))
        : typeof data.toString === `function`
          ? colors[logColor](data.toString())
          : colors[logColor](data)
    })

    if(!TAG_DISABLED && logger.tag){
      logMethod === 'dir' || logMethod === 'table'
        ? logger.stdout(`${logger.tag} `)
        : toLog.unshift(logger.tag)
    }

    console[logMethod](...toLog)
  }
}

/**
 * Class with helper methods to log data to the terminal or console
 * @Class
 * @param {Object} props - Options for configuring the Log Class instance
 * @returns {Object} - Instance of the Log Class
 */
class Log {

  tag = false

  constructor(props) {
    this.colorMap = {
      data: 'white',
      dir: 'white',
      error: 'red',
      fail: 'red',
      info: 'cyan',
      log: 'white',
      success: 'green',
      text: 'white',
      warn: 'yellow',
      green: 'green',
      red: 'red',
      yellow: 'yellow',
      cyan: 'cyan',
      magenta: 'magenta',
      blue: 'blue',
      gray: 'gray',
    }

    this.default = get(props, 'default', 'log')

    // Loop the colorMap and build the log method for it
    Object.keys(this.colorMap).map(key => (this[key] = logData(this, key)))

    // Add the colors module for easy access
    this.colors = colors

    this.log = this.print
  }

  /**
   * Set a tag value for all logged messages
   * @instance
   * @memberof Log
   * @function
   * @param {string} tag - Text that should be used as the tag
   * @param {string} color - Color of tag when logged
   */
  setTag = (tag, color) => {
    if(!tag) return this.warn(`Tag must be of type string`, tag)

    this.tag = color
      ? colors[this.colorMap[color] || color](tag)
      : tag
  }

  /**
   * Removes the defined tag from the Log instance
   * @instance
   * @memberof Log
   * @function
   *
   */
  removeTag = () => {
    this.tag = undefined
  }

  /**
   * Toggle the Log instance tag on or off
   * @instance
   * @memberof Log
   * @function
   *
   */
  toggleTag = () => {
    if(!TAG_DISABLED) TAG_DISABLED = true
    else TAG_DISABLED = false
  }

  /**
   * Helper to create a string in the passed in color
   * @instance
   * @memberof Log
   * @function
   * @param {string} colorName - name of the color to use
   * @param {string} data - data to set color for
   *
   * @returns {void}
   */
  color = (colorName, data) =>
    colors[this.colorMap[colorName] || colorName](data)

  /**
   * Helper to print the passed in data
   * <br/>Similar to calling `console.log(...data)`
   * @instance
   * @memberof Log
   * @function
   *
   * @returns {void}
   */
  print = (...data) => {
    !TAG_DISABLED &&
      this.tag &&
      data.unshift(this.tag)
    console.log(...data)
  }

  /**
   * Helper to change the default colors
   * @instance
   * @memberof Log
   * @function
   *
   * @returns {void}
   */
  setColors = colorMap => {
    typeof colorMap === `object`
      && (this.colorMap = { ...this.colorMap, ...colorMap })
  }

  /**
   * Helper to log an empty line
   * @instance
   * @memberof Log
   * @function
   *
   * @returns {void}
   */
  empty = () => console.log('')

  /**
   * Helper to print out a table.
   * @instance
   * @memberof Log
   * @function
   * @see docs about params here: https://developer.mozilla.org/en-US/docs/Web/API/Console/table
   * @returns {void}
   */
  table = (...args) => {
    !TAG_DISABLED &&
      this.tag &&
      args.unshift(this.tag)

    console.table(...args)
  }

  /**
   * Helper to log out a CLI message header
   * @instance
   * @memberof Log
   * @function
   *
   * @param {string} title - Text to print as the header
   * @param {string} color - Color of the header text
   *
   * @returns {void}
   */
  header = (title, color) => {
    const tagState = TAG_DISABLED
    TAG_DISABLED = true

    const middle = `              ${title}              `

    const line = middle.split('').reduce((line, item, index) => (line += ' '))

    color = color || 'green'

    this.empty(``)
    this.print(colors.underline[color](line))
    this.print(line)
    this.print(colors[color](middle))
    this.print(colors.underline[color](line))
    this.empty(``)

    TAG_DISABLED = tagState
  }

  /**
   * Helper to log out a CLI message sub-header
   * @instance
   * @memberof Log
   * @function
   *
   * @param {string} title - Text to print as the sub-header
   * @param {string} color - Color of the header text
   *
   * @returns {void}
   */
  subHeader = (title, color) => {
    const tagState = TAG_DISABLED
    TAG_DISABLED = true
    
    const middle = `          ${title}       `

    const line = middle.split('').reduce((line, item, index) => (line += ' '))

    color = color || 'white'

    this.empty(``)
    this.print(colors[color](middle))
    this.print(`  ${colors.underline[color](line)}`)
    this.empty(``)

    TAG_DISABLED = tagState
  }

  /**
   * Helper to log a title and message in separate colors
   * @instance
   * @memberof Log
   * @function
   * @param {string} title - Prints the string in the color `cyan`
   * @param {string} message - Prints the string in the color `white`
   *
   * @returns {void}
   */
  pair = (title, message) => {
    const toLog = []
    // Check that the title and message exist, then add to the toLog array
    title && toLog.push(Logger.colors.brightCyan(title))
    message && toLog.push(Logger.colors.brightWhite(message))

    toLog.length && this.print(...toLog)
  }

  /**
   * Alias for `Log.pair`
   * @instance
   * @memberof Log
   * @function
   */
  label = (...args) => this.pair(...args)

  /**
   * Helper to log a spaced title and message in separate colors
   * @instance
   * @memberof Log
   * @function
   * @param {string} title - Prints the string in cyan
   * @param {string} message - Prints the string in white
   *
   * @returns {void}
   */
  spacedMsg = (title, message) => {
    this.empty()
    this.pair(title, message)
    this.empty()
  }

  /**
   * Alias for `Log.spacedMsg`
   * @instance
   * @memberof Log
   * @function
   */
  spaceMsg = (...args) => this.spacedMsg(...args)

  /**
   * Writes passed in arguments to the process stdout
   * @instance
   * @memberof Log
   * @function
   * @param {*} - Items to write to process stdout
   */
  stdout = (...args) => process.stdout.write(...args)

  /**
   * Writes to the process stderr
   * @instance
   * @memberof Log
   * @function
   * @param {*} - Items to write to process stderr
   */
  stderr = (...args) => process.stderr.write(...args)

  /**
   * Clears the terminal, does not allow scrolling back
   * @instance
   * @memberof Log
   * @function
   */
  clear = () => {
    process.stdout.write('\u001b[3J\u001b[2J\u001b[1J')
    console.clear()
  }

  /**
   * Helper to highlight a word in a logged message
   * @instance
   * @memberof Log
   * @function
   * @param {string} start - Beginning of the message
   * @param {string} highlight - Part of message to be highlighted
   * @param {string} end - End of the message
   *
   * @returns {void}
   */
  highlight = (start = '', highlight = '', end = '') => {
    this.log(`${start}`, Logger.colors.cyan(highlight), end)
  }
}

/**
 * Create a Log instance, so we have a singleton through out the application
 * @private
 */
const Logger = new Log()

module.exports = {
  Log,
  Logger,
}
