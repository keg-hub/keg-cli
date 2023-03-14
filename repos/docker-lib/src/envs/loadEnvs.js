const { addToProcess } = require('./addToProcess')
const { loadConfigs } = require('@keg-hub/parse-config')

const loadEnvs = (env, locations, name, override) => {
  const mergedEnvs = loadConfigs({
    env,
    name,
    locations,
  })

  // Add the loaded envs to the current process.env
  addToProcess(mergedEnvs, override)

  return mergedEnvs
}

module.exports = {
  loadEnvs,
}
