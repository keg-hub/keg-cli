const { HELP_ARGS } = require('../constants')

const hasHelpArg = (arg) => (HELP_ARGS.includes(arg))

module.exports = {
  hasHelpArg
}
