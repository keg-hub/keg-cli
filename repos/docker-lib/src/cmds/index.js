module.exports = {
  ...require('./build'),
  ...require('./dockerCli'),
  ...require('./dynamicCmd'),
  ...require('./inspect'),
  ...require('./login'),
  ...require('./logs'),
  ...require('./prune'),
  ...require('./pull'),
  ...require('./push'),
  ...require('./raw'),
  ...require('./remove'),
}