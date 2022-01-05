const path = require('path')
const aliases = require('./aliases')
const rootDir = path.join(__dirname, '../../')
const aliasPlugin = require('esbuild-plugin-path-alias')

const getNodeModules = () => {
  const rootPkg = require(path.join(rootDir, 'package.json'))
  return Object.keys(rootPkg.dependencies).concat(Object.keys(rootPkg.devDependencies))
}

// TODO: Investigate adding templates to assets
// Currently templates get included in the bundle, so calls to load a template fails

require('esbuild').build({
  bundle: true,
  format: 'cjs',
  platform: 'node',
  logLevel: 'info',
  external: [
    // TODO: figure out why this is causing such a big build
    // Also cli-utils probably needs to be split up a bit
    '@keg-hub/cli-utils',
  ],
  // external: getNodeModules(),
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