
module.exports = {
  ...require('./buildContainerContext'),
  ...require('./buildContextEnvs'),
  ...require('./buildDockerLogin'),
  ...require('./buildTapContext')
}