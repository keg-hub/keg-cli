/** @module Network */

const { ipIsInRange } = require('./ipIsInRange')
const { PRIVATE_IPV4_CLASSES } = require('../constants/constants')

/**
 * Checks if an Ip is a private Ip address
 * @function
 * @param {String} ip - ipv4 string 
 * @returns {Boolean} - true if the ip is private and ipv4
 */
 const isPrivateIP = ip => {
  return Object
    .values(PRIVATE_IPV4_CLASSES)
    .some(range => ipIsInRange(ip, range[0], range[1]))
}

module.exports = { isPrivateIP }