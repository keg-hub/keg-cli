const toTests = [
  {
    title: `should convert the passed in envs to a build args string`,
    input: [
      {
        TEST: '123',
        OTHER_ENV: 987
      },
      `docker build cmd`,
      [],
    ],
    output: `docker build cmd --build-arg TEST=123 --build-arg OTHER_ENV=987`
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
      `docker build cmd`,
      ['OTHER_ENV']
    ],
    output: `docker build cmd --build-arg TEST=123`
  },
  {
    title: `should return the original command if envs is not an object`,
    input: [
      true,
      `docker build cmd`,
    ],
    output: `docker build cmd`
  },
]

const asTests = [
  {
    title: `Should add the keg and value to the command`,
    input: [`TEST_KEY`, 'test-value', `build cmd`],
    output: `build cmd --build-arg TEST_KEY=test-value`
  },
  {
    title: `Should not add the keg and value if the key is in the filters`,
    input: [`TEST_KEY`, 'test-value', `build cmd`, [`TEST_KEY`]],
    output: `build cmd`
  }
]

const { asBuildArg, toBuildArgs } = require('../buildArgs')

describe('Build Args', () => {

  afterAll(() => jest.resetAllMocks())

  describe('toBuildArgs', () => {
    toTests.map(test => {
      it(test.title, async () => {
        expect(toBuildArgs(...test.input)).toEqual(test.output)
      })
    })
  })
  
  describe('asBuildArg', () => {
    asTests.map(test => {
      it(test.title, async () => {
        expect(asBuildArg(...test.input)).toEqual(test.output)
      })
    })
  })
})

