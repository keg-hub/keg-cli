module.exports = {
  cli: {
    name: 'cli',
    alias: [],
    description: 'Keg CLI specific tasks',
    example: 'keg cli <command> <options>',
    tasks: {
      ...require('./env'),
      ...require('./open'),
      ...require('./print'),
      ...require('./test'),
      ...require('./update'),
    },
  }
}
