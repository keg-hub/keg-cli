const path = require('path')
const aliases = require('./aliases')
const rootDir = path.join(__dirname, '../../')
const aliasPlugin = require('esbuild-plugin-path-alias')

const getNodeModules = () => {
  const rootPkg = require(path.join(rootDir, 'package.json'))
  return Object.keys(rootPkg.dependencies).concat(Object.keys(rootPkg.devDependencies))
}

require('esbuild').build({
  bundle: true,
  format: 'cjs',
  platform: 'node',
  logLevel: 'debug',
  external: getNodeModules(),
  absWorkingDir: rootDir,
  entryPoints: [path.join(rootDir, 'keg-cli.js')],
  outfile: path.join(rootDir, 'keg-cli-bundle.js'),
  plugins: [
    aliasPlugin(aliases),
  ]
})
.then(result => {
  console.log(result)
})
.catch(() => process.exit(1))