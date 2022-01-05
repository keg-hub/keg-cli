const axios = require('axios')
const { limbo, isArr } = require('@keg-hub/jsutils')
const { generalError } = require('KegUtils/error/generalError')
const { getKegSetting, getDefaultEnv } = require('@keg-hub/cli-utils')

/**
 * Gets a list of all containers registered to the keg-proxy
 * @param {string} env - The env the keg-proxy was started in
 * @param {string} host - Domain when the proxy is running
 *
 * @returns {Array} - List of container routes from traefik
 */
const getProxyRoutes = async (env, host) => {
  const domain = host || getKegSetting('defaultDomain')
  const subdomain = env || getDefaultEnv()
  const [ err, res ] = await limbo(axios.get(`http://${subdomain}.${domain}/api/http/routers`))

  return err
    ? generalError(err.message)
    : !isArr(res.data)
      ? generalError(`No routes returned from the proxy server!`, res)
      : res.data
}

module.exports = {
  getProxyRoutes
}