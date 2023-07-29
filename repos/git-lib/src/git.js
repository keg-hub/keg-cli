const gitUtils = require('./utils')
const { Repo } = require('./repo')
const { Remote } = require('./remote')
const { Branch } = require('./branch')
const { gitCmd } = require('./commands')
const { Logger } = require('@keg-hub/cli-utils')
const { getKegGlobalConfig } = require('@keg-hub/cli-utils')
const { gitSSHEnv, buildCmdOpts } = require('./utils/helpers')

const getGitConfig = () => {
  const globalConfig = getKegGlobalConfig()
  return globalConfig.cli.git
}

class Git {

  _isSetup = false

  constructor(options){
    options && this.setup(options)
  }

  setup = (options, force) => {
    options = options || getGitConfig()

    if(this._isSetup && !force) return

    this._isSetup = true
    this.branch = new Branch(this, options)
    this.repo = new Repo(this, options)
    this.remote = new Remote(this, options)
    this.utils = gitUtils
  
    options.sshKey && this.setSSHKey(options.sshKey)

    // Expose the git command line helper
    this.cmd = gitCmd.bind(this)
  }

  /**
  * Sets ssh options to the GIT_SSH_COMMAND env
  * @memberof Git
  * @param {Object} cmdOpts - Options to pass to the spawnCmd
  *
  * @returns {void}
  */
  setSSHKey = keyPath => {
    if(!keyPath)
      return Logger.warn(`git.setSSHKey requires a path to the ssh key as the first argument!`)

    this.ssh = gitSSHEnv(keyPath)
  }

  /**
  * Force cleans a repos changes
  * @memberof Git
  * @param {Object} cmdOpts - Options to pass to the spawnCmd
  *
  * @returns {void}
  */
  reset = async cmdOpts => {
    await gitCmd(`git clean -f .`, buildCmdOpts(cmdOpts))
    return gitCmd(`git reset --hard`, buildCmdOpts(cmdOpts))
  }

  /**
  * Initializes a directory for a git repo
  * @memberof Git
  * @param {Object} cmdOpts - Options to pass to the spawnCmd
  *
  * @returns {boolean} - True if command is scuccessful, false otherwise
  */
  init = async cmdOpts => {
    const [ err, resp ] = await limbo(gitCmd(`git init`, buildCmdOpts(cmdOpts)))
    return err ? false : true
  }

}


const git = new Git()
git.setup()

module.exports = {
  Git,
  git
}
