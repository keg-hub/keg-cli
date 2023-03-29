/** @module Network */
const http = require('http')


/**
 * Gets the public Ip of the host machine using `https://api.ipify.org?format=json`
 * @function
 * @returns {string?} public ip address of current machine
 */
const getPublicIP = async () => {
  return new Promise((res, rej) => {
    http.get({'host': 'api.ipify.org', 'port': 80, 'path': '/'}, (resp) => {
      resp.on('data', (ip) => res(ip))
      resp.on('error', (error) => {
        console.error(error)
        rej(null)
      })
    })
  })
}

module.exports = { getPublicIP }
