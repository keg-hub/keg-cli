const { addToProcess } = require('./addToProcess')
const { loadConfigs } = require('@keg-hub/parse-config')

const loadEnvs = (env, locations) => {
  const mergedEnvs = loadConfigs({
    env,
    locations,
    name: 'wbc',
  })

  // Add the loaded envs to the current process.env
  addToProcess(mergedEnvs)

  return mergedEnvs
}

module.exports = {
  loadEnvs,
}
