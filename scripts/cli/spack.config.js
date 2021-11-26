const path = require('path')
const { config } = require('@swc/core/spack')

const rootDir = path.join(__dirname, '../../')

module.exports = config({
  mode: 'production',
  entry: {
    keg: path.join(rootDir, './keg-cli'),
  },
  output: {
    path: path.join(rootDir, './bin'),
    name: 'keg-cli.js',
  },
});