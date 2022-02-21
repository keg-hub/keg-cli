module.exports = {
  key: {
    name: 'key',
    tasks: {
      ...require('./add'),
      ...require('./print'),
      ...require('./remove'),
    },
    description: `Updates github key in the global config`,
    example: 'keg key <sub-command> <options>',
  }
}