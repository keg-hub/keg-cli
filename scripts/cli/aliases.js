const moduleAlias = require('module-alias')
const path = require('path')
const rootDir = path.join(__dirname, '../../')

const aliases = {
  KegConst: path.join(rootDir, "src/constants"),
  KegCrypto: path.join(rootDir, "src/libs/crypto"),
  KegDocCli: path.join(rootDir, "src/libs/docker"),
  KegLibs: path.join(rootDir, "src/libs"),
  KegMocks: path.join(rootDir, "src/__mocks__"),
  KegProc: path.join(rootDir, "src/libs/process"),
  KegRoot: path.join(rootDir, "."),
  KegScripts: path.join(rootDir, "scripts"),
  KegUtils: path.join(rootDir, "src/utils/")
}

moduleAlias.addAliases(aliases)

module.exports = aliases