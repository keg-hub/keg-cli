const { injectedContainer } = require('KegMocks/injected/injectedTest')
const { docker } = require('KegMocks/libs/docker')
const { testEnum } = require('KegMocks/jest/testEnum')

const { DOCKER } = require('KegConst/docker')
const withInjected = {
  ...DOCKER.CONTAINERS,
  INJECTED: injectedContainer
}
jest.setMock('KegConst/docker', { DOCKER: { ...DOCKER, CONTAINERS: withInjected }})
jest.setMock('@keg-hub/docker-lib', docker)

const { getImgNameContext } = require('../getImgNameContext')

const testArgs = {
  fullUrl: {
    description: 'It should return the imageName context from just an image url',
    inputs: [{ image: `ghcr.io/test-org/test-path/test-app:test-tag` }],
    outputs: {
      image: 'test-app',
      provider: 'ghcr.io',
      namespace: 'test-org/test-path',
      tag: 'test-tag',
      imageWTag: 'test-app:test-tag',
      full: 'ghcr.io/test-org/test-path/test-app:test-tag',
      providerImage: 'ghcr.io/test-org/test-path/test-app',
    }
  },
  imgName: {
    description: 'It should return the imageName context with only an image name',
    inputs: [{ image: 'keg-core' }],
    outputs: {
      image: 'keg-core',
      provider: 'ghcr.io',
      namespace: 'keg-hub',
      tag: 'develop',
      imageWTag: 'keg-core:develop',
      full: 'ghcr.io/keg-hub/keg-core:develop',
      providerImage: 'ghcr.io/keg-hub/keg-core',
    }
  },
  imgTag: {
    description: 'It should return the imageName context with a custom tag and context',
    inputs: [{ context: 'injected', tag: 'test-tag' }],
    outputs: {
      image: 'tap-injected-test',
      provider: 'ghcr.io',
      namespace: 'keg-hub',
      tag: 'test-tag',
      imageWTag: 'tap-injected-test:test-tag',
      full: 'ghcr.io/keg-hub/tap-injected-test:test-tag',
      providerImage: 'ghcr.io/keg-hub/tap-injected-test',
    }
  },
  context: {
    description: 'It should return the imageName context with only a context',
    inputs: [{ context: 'components', tap: 'components' }],
    outputs: {
      image: 'components',
      tag: 'develop',
      provider: 'ghcr.io',
      namespace: 'keg-hub',
      imageWTag: 'components:develop',
      full: 'ghcr.io/keg-hub/components:develop',
      providerImage: 'ghcr.io/keg-hub/components',
    }
  },
  injected: {
    description: 'It should return the imageName context for injected apps',
    inputs: [{ context: 'injected', tap: 'injected' }],
    outputs: {
      image: 'tap-injected-test',
      tag: 'develop',
      provider: 'ghcr.io',
      namespace: 'keg-hub',
      imageWTag: 'tap-injected-test:develop',
      full: 'ghcr.io/keg-hub/tap-injected-test:develop',
      providerImage: 'ghcr.io/keg-hub/tap-injected-test',
    }
  },
  tagOverride: {
    description: 'It should override the image tag',
    inputs: [{ context: 'components', tap: 'components', tag: 'test-tag' }],
    outputs: {
      image: 'components',
      tag: 'test-tag',
      provider: 'ghcr.io',
      namespace: 'keg-hub',
      imageWTag: 'components:test-tag',
      full: 'ghcr.io/keg-hub/components:test-tag',
      providerImage: 'ghcr.io/keg-hub/components',
    }
  },
  providerOverride: {
    description: 'It should override the docker provider',
    inputs: [{ context: 'core', provider: 'my.test-provider.com' }],
    outputs: {
      image: 'core',
      tag: 'develop',
      provider: 'my.test-provider.com',
      namespace: 'keg-hub',
      imageWTag: 'core:develop',
      full: 'my.test-provider.com/keg-hub/core:develop',
      providerImage: 'my.test-provider.com/keg-hub/core',
    }
  },
  namespaceOverride: {
    description: 'It should override the url namespace',
    inputs: [{ context: 'components', tap: 'components', namespace: 'test-namespace' }],
    outputs: {
      image: 'components',
      tag: 'develop',
      provider: 'ghcr.io',
      namespace: 'test-namespace',
      imageWTag: 'components:develop',
      full: 'ghcr.io/test-namespace/components:develop',
      providerImage: 'ghcr.io/test-namespace/components',
    }
  },
  fromOnly: {
    description: 'It should work with only the from param',
    inputs: [{ from: `provider/namespace/keg-items:test` }],
    outputs: {
      image: 'keg-items',
      provider: 'provider',
      namespace: 'namespace',
      tag: 'test',
      imageWTag: 'keg-items:test',
      full: 'provider/namespace/keg-items:test',
      providerImage: 'provider/namespace/keg-items'
    }
  },
  fromOverride: {
    description: 'It use the from param over other params',
    inputs: [{ context: 'components', tap: 'components', tag: 'master', from: `provider/namespace/keg-items:test` }],
    outputs: {
      image: 'keg-items',
      provider: 'provider',
      namespace: 'namespace',
      tag: 'test',
      imageWTag: 'keg-items:test',
      full: 'provider/namespace/keg-items:test',
      providerImage: 'provider/namespace/keg-items'
    }
  },
  fromWithProviderNamespace: {
    description: 'It use the from param over other params',
    inputs: [{ provider: 'not-used', namespace: 'not-used', from: `provider/namespace/keg-items:test` }],
    outputs: {
      image: 'keg-items',
      provider: 'provider',
      namespace: 'namespace',
      tag: 'test',
      imageWTag: 'keg-items:test',
      full: 'provider/namespace/keg-items:test',
      providerImage: 'provider/namespace/keg-items'
    }
  },
  fromNoProviderNamespace: {
    description: 'It use the from param over other params',
    inputs: [{ provider: 'used-provider', namespace: 'used-namespace', from: `keg-items:test` }],
    outputs: {
      image: 'keg-items',
      provider: 'used-provider',
      namespace: 'used-namespace',
      tag: 'test',
      imageWTag: 'keg-items:test',
      full: 'used-provider/used-namespace/keg-items:test',
      providerImage: 'used-provider/used-namespace/keg-items'
    }
  },
  fromImageAndTag: {
    description: 'It should work when from is only an image and tag',
    inputs: [{ from: `keg-items:test` }],
    outputs: {
      image: 'keg-items',
      tag: 'test',
      provider: 'ghcr.io',
      namespace: 'keg-hub',
      imageWTag: 'keg-items:test',
      full: 'ghcr.io/keg-hub/keg-items:test',
      providerImage: 'ghcr.io/keg-hub/keg-items'
    }
  },
  fromOnlyImage: {
    description: 'It should work when from is only an image name',
    inputs: [{ from: `keg-items` }],
    outputs: {
      image: 'keg-items',
      tag: 'develop',
      provider: 'ghcr.io',
      namespace: 'keg-hub',
      imageWTag: 'keg-items:develop',
      full: 'ghcr.io/keg-hub/keg-items:develop',
      providerImage: 'ghcr.io/keg-hub/keg-items'
    }
  },
  imageId: {
    description: 'It should allow passing in an image id',
    inputs: [{ image: 'b80dcb1cac10' }],
    outputs: {
      image: 'keg-core',
      tag: '0.0.1',
      provider: 'ghcr.io',
      namespace: 'keg-hub',
      imageWTag: 'keg-core:0.0.1',
      full: 'ghcr.io/keg-hub/keg-core:0.0.1',
      providerImage: 'ghcr.io/keg-hub/keg-core',
    }
  },
  contextId: {
    description: 'It should allow passing in an image id as the context',
    inputs: [{ context: 'b80dcb1cac10', tag: 'develop' }],
    outputs: {
      image: 'keg-core',
      tag: 'develop',
      provider: 'ghcr.io',
      namespace: 'keg-hub',
      imageWTag: 'keg-core:develop',
      full: 'ghcr.io/keg-hub/keg-core:develop',
      providerImage: 'ghcr.io/keg-hub/keg-core',
    }
  },
  contextIdOverride: {
    description: 'It should allow passing in an id as the context and override with inputs ',
    inputs: [{ context: 'b80dcb1cac10', provider: 'test-provider', namespace: 'test-namespace' }],
    outputs: {
      image: 'keg-core',
      tag: '0.0.1',
      provider: 'test-provider',
      namespace: 'test-namespace',
      imageWTag: 'keg-core:0.0.1',
      full: 'test-provider/test-namespace/keg-core:0.0.1',
      providerImage: 'test-provider/test-namespace/keg-core'
    }
  }
}

describe('getImgNameContext', () => {

  afterAll(() => jest.resetAllMocks())

  testEnum(testArgs, getImgNameContext)

})