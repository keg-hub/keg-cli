const { git } = require('@keg-hub/git-lib')
const { ask } = require('@keg-hub/ask-it')
const { generalError } = require('KegUtils/error')
const { isNum, exists, doIt } = require('@keg-hub/jsutils')
const { Logger, runInternalTask } = require('@keg-hub/cli-utils')

/**
 * Get the branch name based on the branch or the params.remove value
 * @param {string} branches - Local branches for the repo
 * @param {Object} branch - Branch to find ( could be an index )
 * @param {Object} params - Parsed options from the cmd line
 *
 * @returns {string} - Name of found branch
 */
const getBranchName = async (branches, branch, params) => {
  const { remove, list } = params
  // If remove is truthy, check if we should ask for the name/index
  // Otherwise check if branch has a value, if not ask for it
  // Else default to passed in branch
  let useBranch = list && !branch
    ? await ask.input('Please enter the branch name or index')
    : remove
      ? remove === true
        ? await ask.input('Please enter the branch name or index')
        : remove
      : !branch
        ? await ask.input('Please enter the branch name or index')
        : branch
  
  // Check if the useBranch in a numbered index
  // If it is, use it to pull the name from the branch list
  const branchIndex = parseInt(useBranch)
  return isNum(branchIndex) && branches[branchIndex]
    ? branches[branchIndex].name
    : useBranch
}

/**
 * Finds the name of a branch relative to the passed in ref
 * Check if the ref matches the <num>..<num> pattern
 * Converts ref into an array of branch indexes that includes enclosing and in-between indexes
 * @param {Array} branches - Array of all current branches
 * @param {Object} params - Parsed options from the cmd line
 * @param {Object} location - Location of the repo for the branches
 *
 * @returns {Promise<void>}
 */
const findBranchesFromRef = (branches, ref) => {
  let refs = [ref]
  if(ref.includes('..')){
    const [start, end] = ref.split('..')
    const startNum = parseInt(start)
    const endNum = parseInt(end)

    if(isNum(startNum) && isNum(endNum)){
      if(startNum > endNum) generalError(`The end branch index must be greater then the start index`)

      refs = [startNum]
      doIt(endNum - startNum, global, refs, (index, arr) => arr.push(startNum + index + 1))
    }
  }

  return refs.map(ref => (
    branches[ref] ||
      branches.find(branch =>  branch.name === ref) ||
      branches.find(branch =>  branch.commit === ref)
  ))
}

/**
 * Creates a new Git branch
 * @param {string} newBranch - Name of new branch to create
 * @param {Object} location - Location of the repo for the branches
 * @param {Object} params - Parsed options from the cmd line
 * @param {boolean} log - Should log task information
 *
 * @returns {void}
 */
const createNewBranch = async (newBranch, location, params, log=true) => {
  return git.repo.checkout({ ...params, log: false, branch: newBranch, newBranch, location })
}



/**
 * Removes one or many local git branches separated by a ,
 * @param {Array} branches - Array of all current branches
 * @param {Object} params - Parsed options from the cmd line
 * @param {Object} location - Location of the repo for the branches
 *
 * @returns {Promise<void>}
 */
const removeGitBranches = (branches, params, location) => {
  const { remove, list, ...gitParams } = params
  const rmBranches = remove.split(',')

  return rmBranches.reduce(async (toResolve, ref) => {
    await toResolve
    return findBranchesFromRef(branches, ref)
      .reduce(async (childResolve, branch) => {
        await childResolve

        return branch
          ? await git.branch.delete({ ...gitParams, log: false, branch: branch.name, location })
          : Logger.warn(`Could not find branch from reference ${ref}`)
      }, Promise.resolve())
  }, Promise.resolve())
}

/**
 * Git branch task
 * @param {string} branch - Branch to run action on
 * @param {Array} branches - Array of all current branches
 * @param {Object} location - Location of the repo for the branches
 * @param {Object} params - Parsed options from the cmd line
 *
 * @returns {void}
 */
const doBranchAction = async (branch, branches, location, params) => {

  const { remove, list, ...gitParams } = params
  const useBranch = await getBranchName(branches, branch, params)

  Logger.empty()

  ;!exists(useBranch) && !remove
    ? generalError(`Git branch task requires a valid branch name or index!\nGot "${ useBranch }" instead!`)
    : remove
      ? await removeGitBranches(branches, params, location)
      : await git.repo.checkout({ ...gitParams, log: false, branch: useBranch, location })

  Logger.empty()

}

/**
 * Git branch task
 * @param {Object} args - arguments passed from the runTask method
 * @param {string} args.command - Initial command being run
 * @param {Array} args.options - arguments passed from the command line
 * @param {Object} args.tasks - All registered tasks of the CLI
 * @param {Object} globalConfig - Global config object for the keg-cli
 *
 * @returns {void}
 */
const gitBranch = async args => {
  const { params } = args
  const { branch, context, list, new:newBranch, tap, delete:remove, log, ...gitParams } = params

  // Auto call the list task if we reach the gitBranch root task
  const { branches, location, __internal: { switched } } = await runInternalTask(
    'tasks.git.tasks.branch.tasks.list',
    {
      ...args,
      params: {
        tap,
        context,
        log: (list || log || (!branch && !remove && !newBranch)) || false,
        location: params.location,
        ...(branch && !remove && !newBranch && { branch })
      },
      __internal: { ...args.__internal },
  })

  // If already switched branches, just return
  return switched
    ? true
    : newBranch
      ? createNewBranch(newBranch, location, gitParams, gitParams.log)
      : (branch || list || remove) && doBranchAction(branch, branches, location, { list, remove, ...gitParams })

}

module.exports = {
  branch: {
    name: 'branch',
    alias: [ 'br' ],
    action: gitBranch,
    description: `Run git branch commands on a repo.`,
    example: 'keg branch <options>',
    tasks: {
      ...require('./list'),
      ...require('./current'),
      ...require('./reset'),
    },
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
        alias: [ 'path', 'loc' ],
        description: `Location when the git branch command will be run`,
        example: 'keg git branch location=<path/to/git/repo>',
        default: process.cwd()
      },
      tap: {
        description: 'Name of the tap to build a Docker image for',
        example: 'keg git branch --tap visitapps',
      },
      new: {
        description: 'Create a new branch for the context or location',
        example: 'keg git branch --new my-new-branch',
      },
      delete: {
        alias: [ 'del', 'remove', 'rm' ],
        description: 'Delete a one or multiple branches from the existing local branches. Branches separated by comma',
        example: 'keg git branch --delete branch-to-remove',
      },
      force: {
        description: `Force the git fetch action, including pruning local branches`,
        example: 'keg git branch --force',
        default: false
      },
      sub: {
        alias: [ 'submodules', 'modules', 'recurse' ],
        description: `Recursively run a git action on any git submodules`,
        example: 'keg git branch --sub',
        default: false
      },
      list: {
        alias: [ 'ls', 'switch', 'sw' ],
        description: `Prints the current branchs, and asks for a branch to switch to`,
        example: 'keg git branch --list',
      },
      log: {
        alias: [ 'lg' ],
        description: `Logs the git command being run`,
        example: 'keg git branch --log',
      },
    }
  }
}
