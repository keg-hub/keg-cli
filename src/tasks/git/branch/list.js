const { ask } = require('@keg-hub/ask-it')
const { git } = require('@keg-hub/git-lib')
const { generalError } = require('KegUtils/error')
const { isNum, exists } = require('@keg-hub/jsutils')
const { resolveBestPath, Logger } = require('@keg-hub/cli-utils')

/**
 * Checks for a matching branch name based on the passed in branch
 * @param {string} branch - Name of branch to match
 * @param {Array} branches - All local branches for the repo
 *
 * @returns {void}
 */
const getBranchByName = (branch, branches) => {
  return branches.reduce((found, bran) => {
    return found || bran.name !== branch
      ? found
      : bran.name
  }, false)
}

/**
 * Git branch list task. Also allows switching branches
 * @param {Object} args - arguments passed from the runTask method
 * @property {string} args.command - Initial command being run
 * @property {Array} args.options - arguments passed from the command line
 * @property {Object} args.tasks - All registered tasks of the CLI
 * @param {Object} args.params - Parsed options from the cmd line
 * @param {string} args.params.branch - Branch to run action on
 * @param {Object} args.params.location - Location of the repo for the branches
 *
 * @returns {Object} - containing all branches, and the git repo location
 */
const branchList = async (args) => {
  const { globalConfig, params, __internal={} } = args
  const { branch, log } = params
  const { __skipLog } = __internal
  const location = resolveBestPath(params, globalConfig)

  const branches = await git.branch.list(location)

  // Check if we should print the branch list
  !__skipLog && log && git.utils.printBranches(branches)

  // If no branch, just return the response
  if(!exists(branch))
    return {
      branches,
      location,
      __internal: {},
    }

  // Try to get the branch by name
  const branchName = getBranchByName(branch, branches)

  // If no branch by name, and branch is not true, it should then be an numbered index
  let branchIndex = !branchName && branch !== true && parseInt(branch)

  // If no matching branch name, and no branchIndex, then ask for the branch index
  branchIndex = exists(branchIndex)
    ? branchIndex
    : !branchName && parseInt(await ask.input('Please enter the branch name or index'))

  // We either have a branch index or a branch name so check which one and use it
  const useBranch = isNum(branchIndex) && branches[branchIndex]
    ? branches[branchIndex].name
    : branchName

  // Checkout the found branch
  Logger.empty()
  useBranch
    ? await git.repo.checkout({
        location,
        branch: useBranch,
        log: exists(__skipLog) ? !__skipLog : log
      })
    : generalError(
        `Could not find the git branch from "${ branch }"\nEnsure the branch name or index is correct!`
      )

  Logger.empty()

  // return with __internal switched true, so we know branches were already switched
  return {
    location,
    branches,
    __internal: { switched: true }
  }
}

module.exports = {
  list: {
    name: 'list',
    alias: [ 'ls' ],
    description: 'Prints list of local branch for a git repo',
    action: branchList,
    options: {
      branch: {
        description: 'Create a new branch for the context or location',
        example: 'keg git branch --branch my-git-branch',
      },
      context: {
        alias: [ 'name' ],
        description: 'Name of the repo to show branches of, may also be a linked tap',
        example: 'keg git branch context=core',
      },
      location: {
        alias: [ 'loc' ],
        description: `Location when the git branch command will be run`,
        example: 'keg git branch location=<path/to/git/repo>',
      },
      tap: {
        description: 'Name of the tap to build a Docker image for',
        example: 'keg git current --tap visitapps',
      },
      log: {
        alias: [ 'lg' ],
        description: `Logs the git command being run`,
        example: 'keg git branch --log false',
        default: true
      },
    }
  }
}
