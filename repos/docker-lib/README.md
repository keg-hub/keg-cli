# Docker-Lib
Wrapper around the docker command line executable

### Install
With **yarn**
```bash
yarn add @keg-hub/docker-lib
```
With **npm**
```bash
npm install @keg-hub/docker-lib
```

## Setup
* Requires docker executable to be installed, and in the `$PATH`

## Example
```js
// Add the docker lib to your script
const { docker } = require('@keg-hub/docker-lib')

// Execute a command on a docker container...
await docker.container.exec({
  ...args
})

// Create a new image from the container
await docker.container.commit({
  ...args
})

// Tag a new image docker image
await docker.image.tag({
  ...args
})

// Push the new image to a remote repository...
await docker.push({
  ...args
})
```

## API
### TODO
