const { Logger } = require('@keg-hub/cli-utils')
const { PATTERNS } = require('../constants/constants')
const { checkCall, reduceObj, isStr, deepMerge, noOpObj } = require('@keg-hub/jsutils')

const { NEWLINES_MATCH, WHITESPACE_MATCH } = PATTERNS

/**
* Extra git log arguments map. Maps passed in arguments to the real value
* @Object
*
*/
const gitLogArgs = {
  abbrev: '--abbrev-commit',
  pretty: '--pretty=oneline',
}

const gitFetchArgs = {
  all: '--all',
  prune: '-p -P',
  force: '-f',
  sub: '--recurse-submodules',
}

const gitCheckoutArgs = {
  force: '-f',
  ours: '--ours',
  theirs: '--theirs',
  merge: '-m',
  sub: '--recurse-submodules',
}


let GIT_SSH_COMMAND

/**
* Builds the GIT_SSH_COMMAND env for running git commands
* @function
* @param {string} keyPath - Path to the git ssh key locally
*
* @returns {string} - Built ssh command string
*/
const gitSSHEnv = keyPath => {
  if(!keyPath) return {}
  
  // Build the ssh key options
  let sshCmd = `ssh -i ${keyPath}`
  sshCmd += ` -o BatchMode=yes`
  sshCmd += ` -o UserKnownHostsFile=/dev/null`
  sshCmd += `-o StrictHostKeyChecking=no`

  // Cache the ssh options so we can use them in the buildCmdOpts helper
  GIT_SSH_COMMAND = { GIT_SSH_COMMAND: sshCmd }

  return GIT_SSH_COMMAND

}


/**
* Maps the passed in params to the git method arguments
* @function
* @param {Object} params - Parsed params passed from the command line
*
* @returns {string} - Built argument string
*/
const mapParamsToArgs = (params, args) => {
  return reduceObj(params, (key, value, joined) => {
    return !value
      ? joined
      : isStr(args[key])
        ? `${joined} ${args[key]}`.trim()
        : `${joined} ${key}`.trim()

  }, '').trim()
}


/**
* Finds the arguments that should be passed to the git log command
* @function
* @param {Object} params - Parsed params passed from the command line
*
* @returns {string} - Built argument string
*/
const getLogArgs = params => mapParamsToArgs(params, gitLogArgs)

/**
* Finds the arguments that should be passed to the git fetch command
* @function
* @param {Object} params - Parsed params passed from the command line
*
* @returns {string} - Built argument string
*/
const getFetchArgs = params => mapParamsToArgs(params, gitFetchArgs)

/**
* Finds the arguments that should be passed to the git checkout command
* @function
* @param {Object} params - Parsed params passed from the command line
*
* @returns {string} - Built argument string
*/
const getCheckoutArgs = ({ branch, newBranch, remote='origin', track, ...params }) => {
  let mappedArgs = mapParamsToArgs(params, gitCheckoutArgs)

  // If it's a new branch add it with the -b
  // Otherwise just set branch as the first argument
  mappedArgs = newBranch
    ? `-b ${newBranch} ${mappedArgs}`.trim()
    : `${branch} ${mappedArgs}`.trim()

  // If it's a new branch, and should track the remove version of the branch
  newBranch && track && (mappedArgs += `---track ${remote}/${newBranch}`.trim())

  return mappedArgs
}

/**
 * Formats the gitCli response for remotes into a json object
 * @function
 * @param {string|Array} remotes - text response from the gitCli
 *
 * @returns {Array} - Formatted remote objects
 */
const formatRemotes = (remotes='') => {
  const lines = isStr(remotes)
    ? remotes.split(NEWLINES_MATCH)
    : remotes

  return lines.reduce((mapped, line) => {
    return !line.trim()
      ? mapped
      : mapped.concat(checkCall(() => {
          const [ name, url ] = line.split(WHITESPACE_MATCH)
          return { name, url }
        }))
  }, [])
}

/**
 * Adds the location to the cmdOptions
 * @function
 * @param {Object} cmdOpts - Options to pass to the spawnCmd
 * @param {Object} opts - Extra options to pass to the spawnCmd
 *
 * @returns {Object} - Joined cmd options
 */
const buildCmdOpts = (cmdOpts, opts=noOpObj) => {
  const { location } = opts
  const options = GIT_SSH_COMMAND
    ? deepMerge(cmdOpts.options, { env: { ...GIT_SSH_COMMAND } })
    : cmdOpts.options

  return location
    ? { ...cmdOpts, cwd: location, options }
    : { ...cmdOpts, options }
}

/**
 * Gets a remote from current remotes, or uses the default
 * <br/>Also ensures the remote exists
 * @function
 * @param {string} remote - Remote to ensure
 *
 * @returns {string} - Joined cmd options
 */
const ensureGitRemote = async (git, { action, remote, location }) => {
  // TODO: If remote is not origin, make call to check if remote exists
  return remote || 'origin'
}

/**
 * Gets a branch name from the passed in params or the current location
 * @function
 * @param {string} git - Instance of the Git class
 *
 * @returns {string|boolean} - 
 Branch name or false if not found
 */
const ensureGitBranch = async (git, opts=noOpObj) => {
  const { branch, location, remote, to } = opts

  const useBranch = to || branch
  const useCurrent = !useBranch

  const branches = await git.branch.list(location)
  const foundBranch = branches.reduce((found, branch) => {
    return found
      ? found
      : (useCurrent && branch.current) || branch.name === useBranch
        ? branch
        : found
  }, null)
  
  ;(!foundBranch || !foundBranch.name) && Logger.error(`No git branch found for location ${ location }`)

  return foundBranch
    ? foundBranch.name
    : false

}

module.exports = {
  GIT_SSH_COMMAND,
  buildCmdOpts,
  formatRemotes,
  gitSSHEnv,
  getCheckoutArgs,
  getLogArgs,
  getFetchArgs,
  ensureGitRemote,
  ensureGitBranch,
}
