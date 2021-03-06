const { getAddresses } = require('./getAddresses')

/**
 * @param {string} - (optional) the interface to check. Defaults to the wifi interface en0
 * @returns {Array<string>} the private ip addresses associated with the interface
 */
 const getPrivateIPs = (iface='en0') => getAddresses({ iface, isPrivate: true })
   .map(addrInfo => addrInfo.address)

module.exports = { getPrivateIPs }