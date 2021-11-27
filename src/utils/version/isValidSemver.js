const semver = require('semver')
const { toBool } = require('@keg-hub/jsutils')
const { constants } = require('@keg-hub/cli-utils')

const { SEMVER_TYPES } = constants

/**
 * Validates if version is one of: minor,major,patch or specific semver version
 * @function
 * @param {string} version
 * 
 * @returns {Boolean} - true if valid
 */
const isValidSemver = (version) => {
  const valid = SEMVER_TYPES.indexOf(version) !== -1
    ? true
    : semver.valid(version)
  
  return toBool(valid)
}

module.exports = {
  isValidSemver
}