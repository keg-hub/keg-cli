const { Logger } = require('@keg-hub/cli-utils')
const { getServiceArgs } = require('./getServiceArgs')
const { loadConfigs } = require('@keg-hub/parse-config')
const { get, isArr, isStr, isObj } = require('@keg-hub/jsutils')
const { runActionCmds } = require('KegUtils/actions/runActionCmds')
const { validateAction } = require('KegUtils/actions/validateAction')
const { buildTemplateData } = require('../template/buildTemplateData')


const { buildContainerContext } = require('../builders/buildContainerContext')


/**
 * Runs the sync actions defined in the mutagen.yml sync config
 * <br/>Runs each action in series, one after the other
 * @function
 * @param {Object} serviceArgs - arguments passed from the runTask method
 * @param {string} cmdContext - Context of the container to sync with
 * @param {Array} actions - Actions to run in the container for the sync
 *
 * @returns {Array} - Array of Promises of each sync action
 */
const runActions = (serviceArgs, actions, cmdContext) => {
  return actions.reduce(async (toResolve, action) => {
    await toResolve
    return runActionCmds(serviceArgs, action, cmdContext)
  }, Promise.resolve())
}

/**
 * Converts the actions from object to array
 * <br/>Sets the name of each action to equal the action key
 * <br/>If action is passed, only returns that action in an array
 * @function
 * @param {Object} configActions - Actions to run in the container loaded from config files
 * @param {string} action - Name of the action to run
 *
 * @returns {Array} - Array actions to run
 */
const getActions = (configActions, actionToRun, dependency, allowUndefined) => {
  // Convert the actionToRun in to the correct format
  const actionsMeta = (isStr(actionToRun) && actionToRun.split(',') || actionToRun)
    .map(act => {
      const [key, ...actions] = act.includes(':')
        ? act.split(':')
        : ['tap', act]

      return {key, actions}
    })

  return !isArr(actionsMeta) || !actionsMeta.length || !isObj(configActions)
    ? null
    : actionsMeta.reduce((runActions, {key, actions}) => {
        // Get the sub-actions for the namespace
        const subActs = configActions[key]

        // If no sub actions, then log and continue
        // Otherwise add the sub-act as an action to be run
        !isObj(subActs)
          ? Logger.error(`\nAction "${key}" does not exist for "${ dependency }"\n`)
          : actions.map(act => {
              const meta = validateAction(actions, subActs[act], allowUndefined)

              isObj(meta)
                ? runActions.push({
                    ...meta,
                    name: act,
                  })
                : Logger.error(`\nAction "${key}.${act}" does not exist for "${ dependency }"\n`)
            })

        return runActions
      }, [])
}

/**
 * Starts a mutagen sync between local and a docker container
 * @function
 * @param {Object} args - arguments passed from the runTask method
 * @param {Object} args.globalConfig - Global config object for the keg-cli
 * @param {Object} args.params - Formatted object of the passed in options 
 * @param {string} params.container - Name of the container to run ( core / tap )
 * @param {string} params.tap - Name of tap, if container arg value is `tap`
 * @param {string} params.location - Location where the command should be run
 *
 * @returns {void}
 */
const actionService = async (args, argsExt) => {

  const serviceArgs = getServiceArgs(args, argsExt)
  const { params } = serviceArgs
  const {
    env,
    container,
    __injected,
    allowUndefined
  } = params

  const { contextEnvs, cmdContext } = await buildContainerContext(serviceArgs)

  const actions = await loadConfigs({
    fill: true,
    noEnv: true,
    data: buildTemplateData({
      env,
      container,
      envs: contextEnvs,
      __internal: __injected,
    }),
    ymlPath: 'actions',
    locations: [
      params.__injected.injectPath,
      params.__injected.containerPath
    ]
  })

  // Compare them to the passed in actions
  // Get only the passed in actions, in the correct order
  const actionsToRun = getActions(
    actions,
    get(serviceArgs, 'params.action'),
    cmdContext,
    allowUndefined
  )


  
  // Run the actions on the container
  return await runActions(serviceArgs, actionsToRun, cmdContext)
}

module.exports = {
  actionService
}
