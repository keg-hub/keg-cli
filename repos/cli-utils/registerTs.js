require('esbuild-register/dist/node').register({
  loader: 'ts',
  minify: false,
  target: 'ESNext',
})
