# Keg-Hub Cli-Utils
* Common utility methods for developing Node CLI's and writing custom tasks
* This makes the process faster easier, and removes code duplication across projects
## Install
With **yarn**
```bash
yarn add @keg-hub/cli-utils
```
With **npm**
```bash
npm install @keg-hub/cli-utils
```
### CLI task setup
* `runTask` - Find and execute a task
  * This method allows resolving a task based on the passed in tasks object and arguments
  * It's recommended to add a call it from a node script within your project
  * Then add a reference to that script in your `package.json - scripts` section
    * This allows calling it from a package manager such as `yarn` or `npm` like this =>
      ```js
        // In your package.json file
        "scripts": {
          // ...other scripts
          "task": "node ./tasks/runTask.js",
        }
        
        // In tasks/runTask.js
        const { runTask } = require('@keg-hub/cli-utils')
        const taskDefinitions = require('./taskDefinitions')

        runTask(
          // Object containing all tasks definitions for the project
          taskDefinitions,
          // Default params passed to all tasks
          { env: process.env.NODE_ENV || 'local' }
        )
      ```
    * This above script can then be called like this => `yarn task <task-name> <task-options>`
      * Assuming a `start` task definition exists, running `yarn task start` will call the start task
  * This method will handle
    * Loading the global config defined at `~/.kegConfig/cli.config.json` if it exists
    * Parsing options relative to a task-definitions `options` property
      * They are then passed to the task as the `params` key of the `args` object  
* `setAppRoot` - Register a taps root directory
  * When calling custom tasks outside of the `keg-cli`, calling this method is **recommended**
    * It ensures that in `mono-repo` or `sym-linked` situations, the project root can be properly resolved
    * That said, in **most** cases calling this method is **NOT** needed
      * But, since nothing is inversely affected by it, it's recommended to set it and forget it
      * Add it to the top of a tasks script file like this =>
        ```js
          const { setAppRoot } = require('@keg-hub/cli-utils')
          setAppRoot(appRoot)

          module.exports = { customTask: { ...taskDefinition } }
        ```
      * See [tap-vistapps-app](https://github.com/keg-hub/tap-visitapps-app/blob/master/tasks/index.js) `tasks/index.js` file for an example
* `registerTasks` - Register Custom Tasks
  * In most situations calling `registerTasks` is **NOT** needed
    * It could be used when passing the tasks in the first argument of `runTask` is not possible
      * For example in a third-party package installed as a node module 
    * It must be called prior to the call to the `runTask` method to ensure the tasks are loaded
      * It takes a single `Object` argument that should contain key/value pairs task name/definitions
        For example => `registerTasks({ taskName: { ...taskDefinition } })`
