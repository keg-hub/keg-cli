const { execSync } = require('child_process')
const { getRepoPaths } = require('./getRepoPaths')

/**
 * Runs yarn install for all sub repos, called from `scripts.postinstall` of root package.json
 * @type {function}
 * 
 */
const installRepos = repos => {
  repos = repos || getRepoPaths()
  Object.entries(repos).map(([name, repo]) => {
    console.log(`\nRunning yarn install for ${name}`)
    const response = execSync('yarn', { cwd: repo })
    console.log(response.toString())
  })
}

/**
 * Check if the parent module has a parent
 * If it does, then it was called from code
 * So we should return the method instead of running it automatically
 * 
*/
require.main === module ? installRepos() : (module.exports = { installRepos })