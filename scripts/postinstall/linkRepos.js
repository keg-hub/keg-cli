const path = require('path')
const { execSync } = require('child_process')
const { getRepoPaths } = require('./getRepoPaths')

const rootDir = path.join(__dirname, '../../')

/**
 * Runs yarn link for all sub repos, called from `scripts.postinstall` of root package.json
 * @type {function}
 * 
 */
const linkRepos = () => {
  const repos = getRepoPaths()
  console.log(`\nLinking sub-repos to Keg-CLI...`)
  Object.entries(repos)
    .map(([name, repo]) => {
      const repoPkg = require(path.join(repo, 'package.json'))
      execSync('yarn link', { cwd: repo, stdio: 'ignore' })
      execSync(`yarn link "${repoPkg.name}"`, { cwd: rootDir })
      console.log(`The ${repoPkg.name} repo is now linked to Keg-CLI`)
    })
}

/**
 * Check if the parent module has a parent
 * If it does, then it was called from code
 * So we should return the method instead of running it automatically
 * 
*/
require.main === module ? installRepos() : (module.exports = { linkRepos })