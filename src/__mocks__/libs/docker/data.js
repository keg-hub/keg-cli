const dockerData = {
  containers: {
    tap: {
      command: 'docker-entrypoint.s…',
      createdAt: '2020-06-20 01:49:18 -0700 MST',
      id: 'ba9e35cde327',
      image: 'tap',
      labels: '',
      localVolumes: '0',
      mounts: '',
      name: 'tap',
      networks: 'bridge',
      ports: '80/tcp, 443/tcp, 60710/tcp, 0.0.0.0:19002->19002/tcp, 0.0.0.0:80->19006/tcp',
      runningFor: '12 minutes ago',
      size: '0B',
      status: 'Up 16 minutes',
      context: 'tap',
      noPrefix: 'tap'
    },
    core: {
      command: 'docker-entrypoint.s…',
      createdAt: '2020-06-20 01:49:18 -0700 MST',
      id: 'eb9e92ea6354',
      image: 'keg-core',
      labels: '',
      localVolumes: '0',
      mounts: '',
      name: 'img-keg-core',
      networks: 'bridge',
      ports: '80/tcp, 443/tcp, 60710/tcp, 0.0.0.0:19002->19002/tcp, 0.0.0.0:80->19006/tcp',
      runningFor: '16 minutes ago',
      size: '0B',
      status: 'Up 16 minutes',
      context: 'core',
      prefix: 'img-keg-core',
      noPrefix: 'keg-core'
    },
    base: {
      command: 'docker-entrypoint.s…',
      createdAt: '2020-06-25 23:22:34 -0700 MST',
      id: '3ad8d5edbf6c',
      image: 'keg-base',
      labels: '',
      localVolumes: '0',
      mounts: '',
      name: 'package-keg-base',
      networks: 'bridge',
      ports: '80/tcp, 443/tcp, 873/tcp, 8080-8082/tcp, 0.0.0.0:19002->19002/tcp, 19000-19001/tcp, 60710/tcp, 0.0.0.0:19006->19006/tcp',
      runningFor: '27 minutes ago',
      size: '0B',
      status: 'Exited (137) 11 hours ago',
      context: 'base',
      prefix: 'img-keg-base',
      noPrefix: 'keg-base'
    },
    random: {
      command: 'docker-entrypoint.s…',
      createdAt: '2020-06-25 23:22:34 -0700 MST',
      id: '1caa46fa11ba',
      image: 'random',
      labels: '',
      localVolumes: '0',
      mounts: '',
      name: 'test-random',
      networks: 'bridge',
      ports: '80/tcp, 443/tcp, 873/tcp, 8080-8082/tcp, 0.0.0.0:19002->19002/tcp, 19000-19001/tcp, 60710/tcp, 0.0.0.0:19006->19006/tcp',
      runningFor: '27 minutes ago',
      size: '0B',
      status: 'Up 27 minutes',
      context: 'random',
      prefix: 'test-random',
      noPrefix: 'random'
    },
    ['package-test-tap']: {
      command: 'docker-entrypoint.s…',
      createdAt: '2020-06-25 23:22:34 -0700 MST',
      id: '56aa46fa11ba',
      image: 'package-test-tap',
      labels: '',
      localVolumes: '0',
      mounts: '',
      name: 'package-test-tap',
      networks: 'bridge',
      ports: '80/tcp, 443/tcp, 873/tcp, 8080-8082/tcp, 0.0.0.0:19002->19002/tcp, 19000-19001/tcp, 60710/tcp, 0.0.0.0:19006->19006/tcp',
      runningFor: '27 minutes ago',
      size: '0B',
      status: 'Exited (137) 11 hours ago',
      context: 'tap',
      prefix: 'package-test-tap',
      noPrefix: 'test-tap'
    }
  },
  images: {
    injected: {
      containers: "N/A",
      createdAt: "2021-01-25 00:59:29 -0700 MST",
      createdSince: "2 hours ago",
      digest: "<none>",
      id: "13eefd8c2c3d",
      repository: "ghcr.io/keg-hub/tap-injected-test",
      sharedSize: "N/A",
      size: "2.19GB",
      tag: "develop",
      uniqueSize: "N/A",
      virtualSize: "2.193GB",
      tags: [
        "develop"
      ],
      rootId: "tap-injected-test"
    },
    tap: {
      containers: "N/A",
      createdAt: "2020-10-20 17:02:46 -0700 MST",
      createdSince: "5 hours ago",
      digest: "<none>",
      id: "a2aba7cf204f",
      repository: "ghcr.io/keg-hub/tap",
      sharedSize: "N/A",
      size: "2.15GB",
      tag: "zen-371-booking-button-states",
      uniqueSize: "N/A",
      virtualSize: "2.154GB",
      tags: [
        "zen-371-booking-button-states"
      ],
      rootId: "tap"
    },
    core: {
      containers: "N/A",
      createdAt: "2020-10-20 17:35:56 -0700 MST",
      createdSince: "4 hours ago",
      digest: "<none>",
      id: "b80dcb1cac10",
      repository: "keg-core",
      sharedSize: "N/A",
      size: "714MB",
      tag: "0.0.1",
      uniqueSize: "N/A",
      virtualSize: "713.6MB",
      tags: [
        "0.0.1"
      ],
      rootId: "keg-core"
    },
    base: {
      containers: "N/A",
      createdAt: "2020-10-16 12:00:47 -0700 MST",
      createdSince: "4 days ago",
      digest: "<none>",
      id: "3b74af475ff2",
      repository: "keg-base",
      sharedSize: "N/A",
      size: "430MB",
      tag: "latest",
      uniqueSize: "N/A",
      virtualSize: "429.7MB",
      tags: [
        "0.0.1",
        "latest"
      ],
      rootId: "keg-base"
    }
  },
  inspect: {
    container: {
      tap: {
        id: 'ae6debbb4fcc',
        Config: {
          Cmd: [
            "/bin/bash",
            "container/run.sh"
          ],
        }
      }
    },
    image: {
      core: {
        id: 'b80dcb1cac10',
        Config: {
          Cmd: [
            "/bin/bash",
            "/keg/keg-core/container/run.sh"
          ],
        },
      }
    },
  },
}

// Add inspect reference by ID, to match docker CLI
const tapId = dockerData.inspect.container.tap.id
dockerData.inspect.container[tapId] = dockerData.inspect.container.tap
dockerData.inspect.image[tapId] = dockerData.inspect.container.tap
const coreId = dockerData.inspect.image.core.id
dockerData.inspect.image[coreId] = dockerData.inspect.image.core

global.testDocker = dockerData

const dockerOutput = {
  container: {
    list: '{"Command":"\\"docker-entrypoint.s…\\"","CreatedAt":"2020-06-25 17:52:45 -0700 MST","ID":"084a9d7ab5c5","Image":"keg-core:zen-301-fix-multiple-assets-error","Labels":"com.docker.compose.project.config_files=/Users/keg-hub/keg/keg-core/container/docker-compose.yml,com.docker.compose.project.working_dir=/Users/keg-hub/keg/keg-core/container,com.docker.compose.service=keg-core,com.docker.compose.version=1.26.0,com.docker.compose.config-hash=a39a94914640a3d7482bd8241b80707bd7bf0dcebace814c8c003ba0afeeb505,com.docker.compose.container-number=1,com.docker.compose.oneoff=False,com.docker.compose.project=core","LocalVolumes":"0","Mounts":"","Names":"package-keg-core-zen-301-fix-multiple-assets-error","Networks":"bridge","Ports":"80/tcp, 443/tcp, 19002/tcp, 60710/tcp, 0.0.0.0:80-\u003e19006/tcp","RunningFor":"57 minutes ago","Size":"0B","Status":"Up 57 minutes"}\n{"Command":"\\"docker-entrypoint.s…\\"","CreatedAt":"2020-06-25 17:52:45 -0700 MST","ID":"084a9d7ab5c5","Image":"keg-core:zen-301-fix-multiple-assets-error","Labels":"com.docker.compose.project.config_files=/Users/keg-hub/keg/keg-core/container/docker-compose.yml,com.docker.compose.project.working_dir=/Users/keg-hub/keg/keg-core/container,com.docker.compose.service=keg-core,com.docker.compose.version=1.26.0,com.docker.compose.config-hash=a39a94914640a3d7482bd8241b80707bd7bf0dcebace814c8c003ba0afeeb505,com.docker.compose.container-number=1,com.docker.compose.oneoff=False,com.docker.compose.project=core","LocalVolumes":"0","Mounts":"","Names":"package-keg-core-zen-301-fix-multiple-assets-error","Networks":"bridge","Ports":"80/tcp, 443/tcp, 19002/tcp, 60710/tcp, 0.0.0.0:80-\u003e19006/tcp","RunningFor":"57 minutes ago","Size":"0B","Status":"Up 57 minutes"}',
  },
  image: {
    list: `{"Containers":"N/A","CreatedAt":"2020-06-25 16:25:31 -0700 MST","CreatedSince":"2 hours ago","Digest":"\u003cnone\u003e","ID":"054ad4eab1a5","Repository":"keg-core","SharedSize":"N/A","Size":"833MB","Tag":"0.0.1","UniqueSize":"N/A","VirtualSize":"832.9MB"}\n{"Containers":"N/A","CreatedAt":"2020-06-25 16:25:31 -0700 MST","CreatedSince":"2 hours ago","Digest":"\u003cnone\u003e","ID":"054ad4eab1a5","Repository":"keg-core","SharedSize":"N/A","Size":"833MB","Tag":"latest","UniqueSize":"N/A","VirtualSize":"832.9MB"}\n{"Containers":"N/A","CreatedAt":"2020-06-25 16:21:57 -0700 MST","CreatedSince":"2 hours ago","Digest":"\u003cnone\u003e","ID":"67957d546e40","Repository":"keg-base","SharedSize":"N/A","Size":"408MB","Tag":"0.0.1","UniqueSize":"N/A","VirtualSize":"407.9MB"}\n{"Containers":"N/A","CreatedAt":"2020-06-25 16:21:57 -0700 MST","CreatedSince":"2 hours ago","Digest":"\u003cnone\u003e","ID":"67957d546e40","Repository":"keg-base","SharedSize":"N/A","Size":"408MB","Tag":"latest","UniqueSize":"N/A","VirtualSize":"407.9MB"}\n{"Containers":"N/A","CreatedAt":"2020-06-24 18:34:06 -0700 MST","CreatedSince":"24 hours ago","Digest":"\u003cnone\u003e","ID":"2e038b36c4b0","Repository":"keg-core","SharedSize":"N/A","Size":"841MB","Tag":"zen-301-fix-multiple-assets-error","UniqueSize":"N/A","VirtualSize":"841.3MB"}\n{"Containers":"N/A","CreatedAt":"2020-06-24 18:34:06 -0700 MST","CreatedSince":"24 hours ago","Digest":"\u003cnone\u003e","ID":"2e038b36c4b0","Repository":"ghcr.io/keg-hub/keg-core","SharedSize":"N/A","Size":"841MB","Tag":"zen-301-fix-multiple-assets-error","UniqueSize":"N/A","VirtualSize":"841.3MB"}`,
    getCmd: {
      'keg-base': 'node',
      tap: '/bin/sh -c /bin/bash $DOC_CLI_PATH/containers/tap/run.sh "sleep"'
    },
  },
}


const dockerObjLabels = {
  base: {
    'com.keg.env.context': 'keg-base',
    'com.keg.path.context': 'keg-cli',
    'com.keg.path.container': '/keg-hub',
    'com.keg.path.compose': '/keg-cli/containers/base/docker-compose.yml',
    'com.keg.path.values': '/keg-cli/containers/base/values.yml',
    'com.keg.path.docker': '/keg-cli/containers/base/Dockerfile',
    'com.keg.proxy.domain': 'base'
  },
  core: {
    'com.keg.env.context': 'keg-core',
    'com.keg.env.cmd': 'tap:start',
    'com.keg.env.port': '19006',
    'com.keg.path.context': 'keg-core',
    'com.keg.path.container': '/keg/keg-core',
    'com.keg.path.compose': 'keg-core/container/docker-compose.yml',
    'com.keg.path.values': 'keg-core/container/values.yml',
    'com.keg.path.docker': 'keg-core/container/Dockerfile',
    'com.keg.proxy.domain': 'core'
  },
  proxy: {
    'com.keg.env.context': 'keg-proxy',
    'com.keg.path.container': '/keg/tap',
    'com.keg.path.compose': '/keg-cli/containers/proxy/docker-compose.yml',
    'com.keg.path.values': '/keg-cli/containers/proxy/values.yml',
    'com.keg.path.docker': '/keg-cli/containers/proxy/Dockerfile',
    'com.keg.proxy.domain': 'proxy'
  },
  tap: {
    'com.keg.env.context': 'tap',
    'com.keg.env.cmd': 'tap:start',
    'com.keg.env.port': '19006',
    'com.keg.path.context': 'INITIAL',
    'com.keg.path.container': '/keg/tap',
    'com.keg.path.compose': '/keg-cli/containers/tap/docker-compose.yml',
    'com.keg.path.values': '/keg-cli/containers/tap/values.yml',
    'com.keg.path.docker': '/keg-cli/containers/tap/Dockerfile',
    'com.keg.proxy.domain': 'tap'
  },
  injected: {
    'com.keg.env.context': 'tap',
    'com.keg.env.cmd': 'tap:start',
    'com.keg.env.port': '19006',
    'com.keg.path.context': '/keg-hub/taps/tap-injected-test',
    'com.keg.path.container': '/keg/tap',
    'com.keg.path.compose': '/keg-cli/containers/tap/docker-compose.yml',
    'com.keg.path.values': '/keg-cli/containers/tap/values.yml',
    'com.keg.path.docker': '/keg-cli/containers/tap/Dockerfile',
    'com.keg.proxy.domain': 'injected',
  }
}

const dockerLabels = Object.entries(dockerObjLabels)
  .reduce((allLabels, [ key, labels]) => {
    allLabels[key] = Object.entries(labels) 
      .reduce((joined, [ name, value]) => {
        return joined += ` --label "${name}=${value}"`
      }, '').trim()

    return allLabels
  }, {})

const package = {
  core: {
    account: 'keg-hub',
    image: 'keg-core',
    provider: 'ghcr.io',
    tag: 'test-core'
  },
  tap: {
    account: 'keg-hub',
    image: 'tap',
    provider: 'ghcr.io',
    tag: 'test-tap'
  }
}

const proxyOpts = {
  core: [
    '--option-core',
    '--label traefik.enable=true',
    '--label traefik.http.routers.core.rule=Host(`core-test-core.local.kegdev.xyz`)',
    '--label traefik.http.services.core.loadbalancer.server.port=19006',
    '--label traefik.http.routers.core.entrypoints=keg',
    '--network keg-hub-net'
  ],
  tap: [
    '--option-tap',
    '--label traefik.enable=true',
    '--label traefik.http.routers.tap.rule=Host(`tap-test-tap.local.kegdev.xyz`)',
    '--label traefik.http.services.tap.loadbalancer.server.port=19006',
    '--label traefik.http.routers.tap.entrypoints=keg',
    '--network keg-hub-net'
  ]
}

module.exports = {
  dockerData,
  dockerLabels,
  dockerObjLabels,
  dockerOutput,
  package,
  proxyOpts
}