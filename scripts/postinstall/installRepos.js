const { execSync } = require('child_process')
const { setupError } = require('./setupError')
const { getRepoPaths } = require('./getRepoPaths')

/**
 * Runs yarn install for all sub repos, called from `scripts.postinstall` of root package.json
 * @type {function}
 * @param {Object} repos - Name/Locations of all sub-repos in the /repos directory
 * 
 * @returns {Void}
 */
const installRepos = repos => {
  // Only install in NON-CI environment
  if(process.env.GITHUB_ACTIONS) return

  try {
    repos = repos || getRepoPaths()
    const failed = []

    Object.entries(repos)
      .map(([name, repo]) => {
        try {
          console.log(`\nRunning yarn install for ${name}`)
          const response = execSync('yarn', { cwd: repo })
          console.log(response.toString())
        // Catch the error here, so it will still try to install for the other repos
        } catch(err){failed.push([repo, err])}
      })

    // After install, log any errors the might have occurred
    failed.map(([repo, err]) => setupError(err, `Failed command "yarn install" in repo ${repo}.`))
  }
  catch(err){
    setupError(err, `Failed command "yarn install". Please run the command manually`, 1)
  }
}

/**
 * Check if the parent module has a parent
 * If it does, then it was called from code
 * So we should return the method instead of running it automatically
 * 
*/
require.main === module ? installRepos() : (module.exports = { installRepos })