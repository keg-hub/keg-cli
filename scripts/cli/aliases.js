const path = require('path')
const moduleAlias = require('module-alias')
const rootDir = path.join(__dirname, '../../')

const aliases = {
  KegRoot: path.join(rootDir, '.'),
  KegUtils: path.join(rootDir, 'src/utils'),
  KegScripts: path.join(rootDir, 'scripts'),
  KegMocks: path.join(rootDir, 'src/__mocks__'),
  KegConst: path.join(rootDir, 'src/constants'),
  KegCrypto: path.join(rootDir, 'src/libs/crypto'),
}

moduleAlias.addAliases(aliases)

module.exports = aliases