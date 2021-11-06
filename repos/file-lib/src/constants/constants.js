const { deepFreeze } = require('@keg-hub/jsutils')

/**
 * Default files that are ignored when searching a directory tree of the filesystem
 * @Array
 */
 const defaultFileExclude = [
  `.DS_Store`,
  `.gitignore`,
  `.gitkeep`,
]

module.exports = deepFreeze({
  defaultFileExclude
})