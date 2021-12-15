const { getKegSetting } = require('@keg-hub/cli-utils')
/**
 * Throws task failed error
 *
 * @returns {void}
 */
const throwTaskFailed = () => {
  getKegSetting('errorStack')
    ? (() => { throw new Error(`Task failed!`) })()
    : process.exit(1)
}

module.exports = {
  throwTaskFailed
}