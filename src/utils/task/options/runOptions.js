const { dockerOptions } = require('./dockerOptions')
const { contextOptions } = require('./contextOptions')

const runOptions = (task, action, options) => {
  return {
    ...contextOptions(task, action, options),
      cleanup: {
        alias: [ 'clean', 'rm' ],
        description: 'Auto remove the docker container after exiting',
        example: `keg ${task} ${action} --no-cleanup`,
        default: true
      },
      options: {
        alias: [ 'opts' ],
        description: 'Extra docker run command options',
        example: `keg ${task} ${action} --options \\"-p 80:19006 -e MY_ENV=data\\"`,
        type: 'array',
        default: []
      },
      command: {
        alias: [ 'cmd' ],
        description: 'Overwrite entry of the image. Use escaped quotes for spaces ( bin/bash )',
        example: `keg ${task} ${action} --command \\"node index.js\\"`,
        default: '/bin/bash'
      },
      entrypoint: {
        alias: [ 'entry', 'ent', 'ep' ],
        description: 'Override the default entrypoint of the docker image',
        example: 'keg ${task} ${action} --entry /bin/bash',
      },
      connect: {
        alias: [ 'conn', 'con', 'it' ],
        description: 'Auto connects to the docker containers stdio',
        example: `keg ${task} ${action} --no-connect`,
        default: true
      },
      network: {
        alias: [ 'net' ],
        description: 'Set the docker run --network option to this value',
        example: 'keg docker package run --network host'
      },
      sync: {
        description: 'Creates a mutagen sync between the local Keg-CLI and the docker container',
        example: `keg ${task} ${action} --sync false`,
        default: false,
      },
      volumes: {
        description: 'Mount the local volumes defined in the docker-compose config.yml.',
        example: `keg ${task} ${action} run --volumes`,
        default: [],
        type: 'array'
      },
      ports: {
        alias: [ 'port' ],
        description: 'Exposes the ports to your local, from the docker container',
        example: 'keg ${task} ${action} --ports 5005:5005,1604',
        default: [],
        type: 'array',
      },
      proxyPort: {
        alias: [ 'pp', 'proxy', 'pport' ],
        description: `Port to register with the keg-proxy`,
        example: `keg docker package run --proxyPort 8080`,
      },
      log: {
        description: 'Log the output the of commands',
        example: `keg ${task} ${action} --log`,
        default: false,
      },
      privileged: {
        alias: [ 'priv' ],
        description: 'Set the docker run --privileged flag',
        example: `keg ${task} ${action} --no-privileged`,
        default: true,
      },
    ...dockerOptions(task, action),
  }
}

module.exports = {
  runOptions
}