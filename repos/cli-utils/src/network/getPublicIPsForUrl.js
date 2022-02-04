/** @module Network */

const dns = require('dns')

/**
 * Gets the public Ips for the passed in url via the `dns#resolve` method
 * @function
 * @param {String} url - Valid Url
 * @returns {Promise} a promise that resolves to the ip address mapped to the url
 */
const getPublicIPsForUrl = url => {
  return new Promise((res, rej) => {
    dns.resolve4(url, (err, addresses) => {
      err
        ? rej(err)
        : res(addresses)
    })
  })
}

module.exports = { getPublicIPsForUrl }