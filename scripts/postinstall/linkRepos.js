const path = require('path')
const { execSync } = require('child_process')
const { getRepoPaths } = require('./getRepoPaths')

const rootDir = path.join(__dirname, '../../')

/**
 * Creates a yarn link for the passed in location
 * @param {string} repo - Path to the repo where the link should created
 * 
 * @returns {Void}
 */
const createLink = repo => {
  execSync('yarn link', { cwd: repo, stdio: 'ignore' })
}

/**
 * Adds a yarn link to the passed in location
 * @param {string} loc - Location where the link should be added
 * @param {string} name - Name of the repo the link is being added to
 * @param {string} link - Name of the link created from the createLink method
 * 
 * @returns {Void}
 */
const addLinkTo = (loc, name, link) => {
  execSync(`yarn link "${link}"`, { cwd: loc, stdio: 'ignore' })
}

/**
 * Ensures a yarn link exists for the sub-repo 
 * If not, then it creates one
 * @param {Object} repos - Name/Locations of all sub-repos in the /repos directory
 * 
 * @returns {Array<Object>} packages - Group of sub-repos containing package.json content and location
 */
const ensurePackageLinks = repos => {
  return Object.values(repos)
    .reduce((packages, repo) => {
      try {
        const repoPkg = require(path.join(repo, 'package.json'))
        repoPkg && packages.push({loc: repo, package: repoPkg})
        createLink(repo)
      }
      catch(err){}

      return packages
    }, [])
}

/**
 * Create links between sub-repos
 * Loop over packages, and check its deps for matching deps
 * Create a yarn link if a dep is found
 * @param {Array<Object>} packages - Group of sub-repos containing package.json content and location
 * 
 * @returns {Void}
 */
const linkSubRepos = packages => {
  packages.map(({ loc, package:current })=> {
    console.log(`  * Creating links for ${current.name}`)
    packages.map(({ package:other }) => {
      let hasDep = (current.dependencies && current.dependencies[other.name])
      hasDep = hasDep || (current.devDependencies && current.devDependencies[other.name])
      hasDep && addLinkTo(loc, current.name, other.name)
    })
  })
}

/**
 * Runs yarn link for all sub repos, called from `scripts.postinstall` of root package.json
 * @type {function}
 * 
 * * @param {Object} repos - Name/Locations of all sub-repos in the /repos directory
 * 
 * @returns {Void}
 */
const linkRepos = repos => {
  try {
    console.log(`\nInter-linking repos within the Keg-CLI...`)
  
    repos = repos || getRepoPaths()
    const packages = ensurePackageLinks(repos)
    // Add root keg-cli package links
    console.log(`  * Creating links for Keg-CLI`)
    packages.map(({ package }) => addLinkTo(rootDir, `Keg-CLI`, package.name))
  
    // Add links to all the sub-repos
    linkSubRepos(packages)
  }
  catch(err){
    console.error(`\nError creating links repos. Please link them manually`)
    console.log(err.stack)
    console.log('\n')
  }
}

/**
 * Check if the parent module has a parent
 * If it does, then it was called from code
 * So we should return the method instead of running it automatically
 * 
*/
require.main === module ? linkRepos() : (module.exports = { linkRepos })