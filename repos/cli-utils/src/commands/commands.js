/** @module Commands */

const { inDocker } = require('./inDocker')
const { getAppRoot } = require('../appRoot')
const { Logger } = require('../logger/logger')
const { isArr, noOpObj, noPropArr, camelCase, isStr, exists } = require('@keg-hub/jsutils')
const { spawnCmd, asyncCmd:execCmd } = require('@keg-hub/spawn-cmd')

/**
 * Ensures the passed in data is an array
 * If data is not an array, it must has a split method to convert to an array
 * @function
 * @private
 * @param {string|Array} [data=[]] - Data to ensure is an array
 *
 * @returns {Array} - Data converted to an array
 */
const ensureArray = (data=noPropArr) => (
  !exists(data)
    ? noPropArr
    : isArr(data)
      ? data
      : isStr(data)
        ? data.split(' ')
        : Logger.error(
            `The runCmd method requires arguments be an Array or string.\n`,
            `Instead got ${typeof data}: ${data}\n`,
            `Args will be ignored!\n`,
          ) || noPropArr
)


/**
 * Normalize the env(s) options by checking for both env && envs
 * Then merges them together
 * @function
 * @private
 * @param {Object} options - Options forwarded to the child process
 * 
 * @return {Object} - Merged env from options object
 */
const normalizeEnv = options => {
  const { envs=noOpObj, env=noOpObj } = options
  return {...envs, ...env}
}

/**
 * Runs a child process using spawnCmd
 * Passes along the current process.env object
 * @function
 * @private
 * @param {string} cmd - Command to run in the child process
 * @param {Array} args - Arguments to pass to the cmd within the child process
 * @param {Object} options - Options forwarded to the child process
 * @param {string} cwd - Directory where the child process should be run from
 * @param {boolean} asExec - Run command with execCmd instead of spawnCmd
 *
 * @returns {Object|undefined} - Object if exec is true, undefined if false
 */
const runCmd = async (cmd, args=noPropArr, options=noOpObj, cwd, asExec) => {
  const {
    exec,
    onStdOut,
    onStdErr,
    onError,
    onExit,
    env,
    envs,
    ...opts
  } = options

  const cmdOpts = {
    ...opts,
    // Normalize the env(s) options
    env: {...process.env, ...normalizeEnv(options)}
  }
  
  return (exec || asExec)
    ? await execCmd(
        `${cmd} ${ensureArray(args).join(' ')}`,
        cmdOpts,
        cwd || getAppRoot()
      )
    : await spawnCmd(cmd, {
        onStdOut,
        onStdErr,
        onError,
        onExit,
        args: ensureArray(args),
        options: cmdOpts,
        cwd: cwd || getAppRoot(),
      })
}

/**
 * Generates helper methods for calling common executables within a child process
 * @Object
 * @private
 */
const shortcutCmds = Array.from([
  'npm',
  'npx',
  'node',
  'yarn',
  'docker',
  'docker-compose',
])
.reduce((cmds, cmd) => {
  /**
   * Creates a helper to call the executable within a child process
   * @private
   * @param {Array|string} args - Arguments to pass to the npm command
   */
  cmds[camelCase(cmd)] = (args, ...opts) => runCmd(cmd, args, ...opts)

  return cmds
}, {})


/**
 * Converts the passed in envs Object into an array of docker argument envs
 * @function
 * @private
 * @param {Object} envs - Key value pair of envs
 *
 * @returns {Array} - Formatted array of envs matching docker cli requirements
 */
const envToStr = envs => Object.keys(envs)
  .reduce((acc, key) => {
    acc.push(`--env`)
    acc.push(`${key}=${envs[key]}`)

    return acc
  }, [])

/**
 * Helper to call the docker exec command directly
 * @function
 * @param {String} containerName - name of container to run command within
 * @param {Array<string>} args - docker exec args
 * @param  {*} opts - docker exec opts
 * @example
 * dockerExec('<container-name>', 'yarn install')
 */
const dockerExec = (containerName, args, opts=noOpObj, ...extra) => {
  const cmdEnvs = normalizeEnv(opts)
  const cmdArgs = [
    'exec',
    '-it',
    ...envToStr(cmdEnvs),
    containerName,
    ...ensureArray(args)
  ]

  return runCmd('docker', cmdArgs, {...opts, env: cmdEnvs}, ...extra)
}

/**
 * Runs a command inside the docker container
 * @function
 * @param {string} containerName - name of container to run command within ( **Ignored** )
 * @param {string|Array<string>} args - docker exec args
 * @param  {Object} opts - docker exec opts
 * @param  {Object} opts.envs - docker exec envs
 * @param  {Object} opts.env - docker exec envs
 * @param  {Array<string>} [extra] - Directory to run the command from
 * @example
 * dockerExec('container', 'npx playwright install firefox')
 */
const containerExec = (_, args, opts=noOpObj, ...extra) => {
  const argsArr = [...ensureArray(args)]
  const cmd = argsArr.shift()

  return runCmd(
    cmd,
    argsArr,
    {...opts, env: normalizeEnv(opts)},
    ...extra
  )
}

/**
 * Checks if inside a docker container.
 * If we are, then cont add call docker executable directly
 * Instead call the command directly inside the container
 * @function
 * @param {string} [containerName] - name of container to run command within ( **Ignored** )
 * @param {string|Array<string>} args - docker exec args
 * @param  {Object} opts - docker exec opts
 * @param  {Object} opts.envs - docker exec envs
 * @param  {Object} opts.env - docker exec envs
 * @param  {Array<string>} [extra] - Directory to run the command from
 *
 */
const dockerCmd = (...args) => inDocker() ? containerExec(...args) : dockerExec(...args)

module.exports = {
  execCmd,
  runCmd,
  spawnCmd,
  dockerCmd,
  dockerExec,
  /**
   * Creates a helper to call the **npx** executable within a child process
   * @function
   * @param {Array|string} args - Arguments to pass to the **npx** command
   * @param {Object} [options] - Options forwarded to the child process
   * @param {Object} options.env - Environment variables to set in the child process
   * @param {boolean} options.exec - Execute the command instead of calling child spawn process
   * @param {string} options.cwd - Directory to execute the command from
   * @example
   * await npx(`http-server ./public -p 3000 --cors`)
   * await npx([`http-server`, `./public`, `-p`, `3000`, `--cors`], { env: { MY_ENV: 'some-value' } })
   * @returns {Object|undefined} - Object if exec is true, undefined if false
   */
  npx: shortcutCmds.npx,
  /**
   * Creates a helper to call the **npm** executable within a child process
   * @function
   * @param {Array|string} args - Arguments to pass to the **npm** command
   * @param {Object} [options] - Options forwarded to the child process
   * @param {Object} options.env - Environment variables to set in the child process
   * @param {boolean} options.exec - Execute the command instead of calling child spawn process
   * @param {string} options.cwd - Directory to execute the command from
   * @example
   * await npm(`start`)
   * await npm([`start`], { env: { NODE_ENV: 'staging' } })
   * @returns {Object|undefined} - Object if exec is true, undefined if false
   */
  npm: shortcutCmds.npm,
  /**
   * Creates a helper to call the **node** executable within a child process
   * @function
   * @param {Array|string} args - Arguments to pass to the **node** command
   * @param {Object} [options] - Options forwarded to the child process
   * @param {Object} options.env - Environment variables to set in the child process
   * @param {boolean} options.exec - Execute the command instead of calling child spawn process
   * @param {string} options.cwd - Directory to execute the command from
   * @example
   * await node(`./index.js`)
   * await node([`./index.js`], { cwd: process.env.HOME, env: { KEY: 'VALUE' } })
   * @returns {Object|undefined} - Object if exec is true, undefined if false
   */
  node: shortcutCmds.node,
  /**
   * Creates a helper to call the **yarn** executable within a child process
   * @function
   * @param {Array|string} args - Arguments to pass to the **yarn** command
   * @param {Object} [options] - Options forwarded to the child process
   * @param {Object} options.env - Environment variables to set in the child process
   * @param {boolean} options.exec - Execute the command instead of calling child spawn process
   * @param {string} options.cwd - Directory to execute the command from
   * @example
   * await yarn(`start`)
   * await yarn([`start`])
   * @returns {Object|undefined} - Object if exec is true, undefined if false
   */
  yarn: shortcutCmds.yarn,
  /**
   * Creates a helper to call the **docker** executable within a child process
   * @function
   * @param {Array|string} args - Arguments to pass to the **docker** command
   * @param {Object} [options] - Options forwarded to the child process
   * @param {Object} options.env - Environment variables to set in the child process
   * @param {boolean} options.exec - Execute the command instead of calling child spawn process
   * @param {string} options.cwd - Directory to execute the command from
   * @example
   * await docker(`exec my-container /bin/bash`)
   * await docker([`exec`, `my-container`, `/bin/bash`], { env: {PORT: 1000}, exec: true })
   * @returns {Object|undefined} - Object if exec is true, undefined if false
   */
  docker: shortcutCmds.docker,
  /**
   * Creates a helper to call the **docker-compose** executable within a child process
   * @function
   * @param {Array|string} args - Arguments to pass to the **docker-compose** command
   * @param {Object} [options] - Options forwarded to the child process
   * @param {Object} options.env - Environment variables to set in the child process
   * @param {boolean} options.exec - Execute the command instead of calling child spawn process
   * @param {string} options.cwd - Directory to execute the command from
   * @example
   * await dockerCompose(`up`)
   * await dockerCompose([`up`, `-f`, `./path/to/docker-compose.yml`])
   * @returns {Object|undefined} - Object if exec is true, undefined if false
   */
  dockerCompose: shortcutCmds.dockerCompose,
}
