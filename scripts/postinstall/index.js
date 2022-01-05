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

  // Only run sub-repo setup in NON-CI environment
  if(process.env.GITHUB_ACTIONS) return

  // Gets all repos folders from `<cli-root>/repos` directory
  const repos = getRepoPaths()

  // Finds all sub-repos with a package.json
  // Then runs yarn install on them
  installRepos(repos)

  // Then link each one to the root node_modules directory
  linkRepos(repos)

})()