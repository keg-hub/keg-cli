const { checkCall } = require('@keg-hub/jsutils')

/**
 * Copies from one file path to another
 * @function
 * @param {string} from - Path to copy from
 * @param {string} to - Path to copy to
 * @param {string} [format=utf8] - Format of the file
 *
 * @returns {Object} - Contains the readStream and writeStream
 */
 const copyStream = (from, to, cb, format = 'utf8') => {
  const writeStream = fs.createWriteStream(to)
  const readStream = fs.createReadStream(from, { encoding: format })
  writeStream.on('finish', () => checkCall(cb))

  readStream.pipe(writeStream)

  return { readStream, writeStream }
}

module.exports = {
  copyStream
}