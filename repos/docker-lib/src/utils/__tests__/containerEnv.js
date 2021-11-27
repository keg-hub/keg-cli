const toTests = [
  {
    title: `should convert the passed in envs to a build args string`,
    input: [
      {
        TEST: '123',
        OTHER_ENV: 987
      },
      `docker run cmd`,
      [],
    ],
    output: `docker run cmd -e TEST=123 -e OTHER_ENV=987`
  },
  {
    title: `should not throw when no filter array is passed`,
    input: [
      {},
      `docker`,
    ],
    output: `docker`
  },
  {
    title: `should not throw when filter is not an array`,
    input: [
      {},
      `docker`,
      12345
    ],
    output: `docker`
  },
  {
    title: `should filter out envs passed in the filter`,
    input: [
      {
        TEST: '123',
        OTHER_ENV: 987
      },
      `docker run cmd`,
      ['OTHER_ENV']
    ],
    output: `docker run cmd -e TEST=123`
  },
  {
    title: `should return the original command if envs is not an object`,
    input: [
      true,
      `docker run cmd`,
    ],
    output: `docker run cmd`
  },
]

const asTests = [
  {
    title: `Should add the keg and value to the command`,
    input: [`TEST_KEY`, 'test-value', `run cmd`],
    output: `run cmd -e TEST_KEY=test-value`
  },
  {
    title: `Should not add the keg and value if the key is in the filters`,
    input: [`TEST_KEY`, 'test-value', `run cmd`, [`TEST_KEY`]],
    output: `run cmd`
  }
]

const { asContainerEnv, toContainerEnvs } = require('../containerEnvs')

describe('toContainerEnvs', () => {
  toTests.map(test => {
    it(test.title, async () => {
      expect(toContainerEnvs(...test.input)).toEqual(test.output)
    })
  })
})

describe('asContainerEnv', () => {
  asTests.map(test => {
    it(test.title, async () => {
      expect(asContainerEnv(...test.input)).toEqual(test.output)
    })
  })
})

