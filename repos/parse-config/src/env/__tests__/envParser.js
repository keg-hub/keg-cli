jest.resetAllMocks()
jest.clearAllMocks()

const { parse, stringify } = require('../envParser')

const envStr = `
  # ENV String
  TEST_PATH={{ test.path }}
  OTHER_PATH=/other/path/

  # --- Middle comment --- #
  BOOL: true
  # Last
  SOME="VALUE"
  ANOTHER='value'
  ITEM=1
  MR=goat
`

const envObj = {
  TEST_PATH: '{{ test.path }}',
  OTHER_PATH: '/other/path/',
  BOOL: true,
  SOME: 'VALUE',
  ANOTHER: 'value',
  ITEM: '1',
  MR: 'goat',
}

const envStrNoComments = `
TEST_PATH={{ test.path }}
OTHER_PATH=/other/path/
BOOL=true
SOME=VALUE
ANOTHER=value
ITEM=1
MR=goat
`

const envStrExpand = ([
  'TEST_PATH=${TEST_PATH}',
  'OTHER_PATH=/other/path/',
  'BOOL=true',
  'REF_VALUE=ref-value',
  'ENVIRONMENT=$NODE_ENV',
  'ITEM="false"',
  'MR=goat',
  'EMPTY_ENV=""',
  "ESCAPED_VALUE=\\$NOT_REPLACED",
  'DOUBLE_REPLACE=${REF_VALUE}-$NODE_ENV'
]).join('\n')

describe('envParser', () => {

  describe('parse', () => {

    it(`should parse the passed in env content`, () => {
      expect(parse(envStr)).toEqual(envObj)
    })

    it(`should parse the passed in env and expand ENVs like terminal/bash expansion`, () => {
      process.env.TEST_PATH = 'some/test/path'
      const parsedEnvs = parse(envStrExpand)
      expect(parsedEnvs.TEST_PATH).toBe('some/test/path')
      expect(parsedEnvs.ENVIRONMENT).toBe(process.env.NODE_ENV)
      expect(parsedEnvs.DOUBLE_REPLACE).toBe(`ref-value-${process.env.NODE_ENV}`)
      expect(parsedEnvs.ESCAPED_VALUE).toBe(`$NOT_REPLACED`)
    })

  })

  describe('stringify', () => {
    it(`should stringify the passed in object into env content file`, () => {
      expect(stringify(envObj).trim()).toEqual(envStrNoComments.trim())
    })
  })

})
