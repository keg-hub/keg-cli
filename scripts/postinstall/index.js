const path = require('path')
const { linkRepos } = require('./linkRepos')
const rootDir = path.join(__dirname, '../../')
const { getRepoPaths } = require('./getRepoPaths')
const { installRepos } = require('./installRepos')
const { makeExecutable } = require('./makeExecutable')

;(async () => {

  // Makes <root_dir>/keg executable
  await makeExecutable(rootDir, 'keg')

  // Makes <root_dir>/keg-cli executable
  await makeExecutable(rootDir, 'keg-cli.js')

})()