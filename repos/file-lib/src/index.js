module.exports = {
  ...require('./copy'),
  ...require('./exists'),
  ...require('./getters'),
  ...require('./readers'),
  ...require('./utils'),
  ...require('./writers'),
  extra: require('fs-extra'),
}
