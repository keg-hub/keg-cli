const { clearConfig } = require('../utils/getConfig')
const {
  testTask1,
  testTask2,
  testTask3,
  testTask4,
  testTask5,
  testTask6,
} = require('../__mocks__/testTasks')


const { argsParse } = require('../argsParse')

describe('argsParse', () => {

  afterAll(() => jest.resetAllMocks())

  describe('parse passed in args array', () => {

    it('should return an object with the arguments parsed', async () => {
  
      const parsed = await argsParse({
        args: [ 'foo=test', 'doo=f' ],
        task: testTask1,
      })
      
      expect(parsed.foo).toBe('test')
      expect(parsed.doo).toBe(false)
  
    })
  
    it('should not parse value matching the next key as the key', async () => {
  
      const parsed = await argsParse({
        args: [ '--context', 'tap', '--tap', 'test' ],
        task: testTask2,
      })
  
      expect(parsed.context).toBe('tap')
      expect(parsed.tap).toBe('test')
  
      const parsed2 = await argsParse({
        args: [ '-c', 'tap', '-t', 'test' ],
        task: testTask2,
      })
  
      expect(parsed2.context).toBe('tap')
      expect(parsed2.tap).toBe('test')
  
    })
  
    it('should call process.exit when a required argument is not passed', async () => {
  
      const orgError = console.error
      console.error = jest.fn()
  
      const orgExit = process.exit
      process.exit = jest.fn()
      
      const parsed = await argsParse({
        args: [ 'foo=test' ],
        task: testTask1,
      })
  
      expect(process.exit).toHaveBeenCalled()
  
      console.error = orgError
      process.exit = orgExit
  
    })

    it('should not parse non-defined task options', async () => {
  
      const parsed = await argsParse({
        args: [ 'doo=test', 'not=defined' ],
        task: testTask1,
      })
  
      expect(parsed.not).toBe(undefined)
  
    })
  
    it('should parse args with -- or =', async () => {
  
      const parsed = await argsParse({
        args: [ 'doo=test', '--foo', 'doot' ],
        task: testTask1,
      })
  
      expect(parsed.doo).toBe('test')
      expect(parsed.foo).toBe('doot')
  
    })

    it('should not parse single "-" for full option keys', async () => {

      const parsed = await argsParse({
        args: [ 'doo=test', '-foo', 'doot' ],
        task: testTask1,
      })
  
      expect(parsed.doo).toBe('test')
      expect(parsed.foo).toBe('bar')
  
    })

  })

  describe('parse special edge-cases', () => {

    afterEach(() => {
      clearConfig()
    })

    it('should set the first arg to the first option if no other args are passed', async () => {
  
      const parsed = await argsParse({
        args: [ 'auto-set' ],
        task: testTask1,
      })
  
      expect(parsed.doo).toBe('auto-set')
  
    })

    it('should convert the value type when the type field is set', async () => {
    
      const testObj = JSON.stringify({
        test: 'object'
      })
      const testArr = JSON.stringify([ 'foo', 'bar' ])
  
      const parsed = await argsParse({
        args: [
          `number=5`,
          `num=0`,
          `object=${ testObj }`,
          `--obj`,
          `${ testObj }`,
          `array=${ testArr }`,
          `arr=1,2,3`,
          `--boolean`,
          'true',
          `bool=false`,
          `--quoted`,
          `"Quoted`,
          `string"`
        ],
        task: testTask3,
      })
  
      expect(parsed.number).toBe(5)
      expect(parsed.num).toBe(0)
      expect(typeof parsed.object).toBe('object')
      expect(parsed.object.test).toBe('object')
      expect(typeof parsed.obj).toBe('object')
      expect(parsed.obj.test).toBe('object')
      expect(Array.isArray(parsed.array)).toBe(true)
      expect(parsed.array[0]).toBe('foo')
      expect(parsed.array[1]).toBe('bar')
      expect(Array.isArray(parsed.arr)).toBe(true)
      expect(parsed.arr[0]).toBe('1')
      expect(parsed.arr[1]).toBe('2')
      expect(parsed.arr[2]).toBe('3')
      expect(parsed.boolean).toBe(true)
      expect(parsed.bool).toBe(false)
      expect(parsed.quoted).toBe('Quoted string')
  
    })

    it('should map the options to the keys when no identifiers are used', async () => {
  
      const parsed = await argsParse({
        args: [ 'test', 'try', 'duper' ],
        task: testTask1,
      })
  
      expect(parsed.doo).toBe('test')
      expect(parsed.foo).toBe('try')
      expect(parsed.baz).toBe('duper')
      expect(parsed.env).toBe('development')
  
    })

    it('should parse quoted string values', async () => {

      const parsed = await argsParse({
        args: [ '-d', "\"I am a long quoted string value\"", '--foo', '\'single quotes\'' ],
        task: testTask1,
      })
  
      expect(parsed.doo).toBe("I am a long quoted string value")
      expect(parsed.foo).toBe("single quotes")
  
    })
  
    it('should parse alias, and set the value to the original option key', async () => {
  
      const parsed = await argsParse({
        args: [ 'd=test', 'zoo=alias' ],
        task: testTask1,
      })
  
      expect(parsed.foo).toBe('alias')
      expect(parsed.zoo).toBe(undefined)
  
    })
  
    it('should convert --no-* arguments to false value', async () => {
  
      const parsed = await argsParse({
        args: [ '--no-foo', '--bar' ],
        task: testTask5,
      })
  
      expect(parsed.foo).toBe(false)
      expect(parsed.bar).toBe(true)
  
    })

  })

  describe('parse short name version of args', () => {
    it('should use the first char as the short name of an option key', async () => {
  
      const parsed = await argsParse({
        args: [ '-d', 'test', '-f', 'doot' ],
        task: testTask1,
      })
  
      expect(parsed.doo).toBe('test')
      expect(parsed.foo).toBe('doot')
  
    })
  
    it('should allow using the short name with =', async () => {
  
      const parsed = await argsParse({
        args: [ 'd=test' ],
        task: testTask1,
      })
  
      expect(parsed.doo).toBe('test')
      expect(parsed.d).toBe(undefined)
  
    })
  })

  describe('parse default args', () => {

    it('should set the default value for an option if no arg is passed', async () => {
  
      const parsed = await argsParse({
        args: [ 'doo=test' ],
        task: testTask1,
      })
  
      expect(parsed.foo).toBe('bar')
  
    })

    it('should allow passing an env argument always', async () => {
  
      const parsed = await argsParse({
        args: [ 'd=test', '--env', 'dev' ],
        task: testTask1,
      })
  
      expect(parsed.env).toBe('development')
  
    })

    it(`should use default when no option is passed and type and default exist`, async () => {

      const parsed = await argsParse({
        args: [],
        task: testTask5,
      })
  
      expect(parsed.foo).toBe(testTask5.options.foo.default)
      expect(parsed.bar).toBe(testTask5.options.bar.default)
      expect(parsed.str).toBe(testTask5.options.str.default)
      expect(parsed.num).toBe(testTask5.options.num.default)
      expect(parsed.arr).toEqual(testTask5.options.arr.default)
      expect(parsed.obj).toEqual(testTask5.options.obj.default)
  
    })

    it('should return only the default options when task has no options', async () => {

      const parsed = await argsParse({
        args: [],
        task: testTask4,
      })
  
      expect(Object.keys(parsed).length).toBe(1)
      expect(Boolean(parsed.env)).toBe(true)
  
    })
  })

  describe(`Use metadata.env to get values from process.env `, () => {

    afterEach(() => {
      delete process.env.TEST_FOO_ENV_VALUE
      delete process.env.TEST_BAR_ENV_BOOL
      delete process.env.TEST_ARR_ENV_ARR
      delete process.env.TEST_NUM_ENV_NUM
    })
    
    it('should use get the value from the env when the metadata exists as the correct type', async () => {
      process.env.TEST_FOO_ENV_VALUE = `foo-value`
      process.env.TEST_BAR_ENV_BOOL = 'yes'
      process.env.TEST_ARR_ENV_ARR = '1,2,3,4'
      process.env.TEST_NUM_ENV_NUM = `1000`
      
      const parsed = await argsParse({
        args: [],
        task: testTask6,
      })
  
      expect(parsed.foo).toBe(`foo-value`)
      expect(parsed.bar).toBe(true)
      expect(parsed.arr).toEqual(['1','2','3','4'])
      expect(parsed.num).toBe(1000)
    })
  
    it('should not use the env when it does not exist', async () => {
      process.env.TEST_FOO_ENV_VALUE = `foo-value`

      expect(process.env.TEST_BAR_ENV_BOOL).toBe(undefined)
      
      const parsed = await argsParse({
        args: [],
        task: testTask6,
      })
  
      expect(parsed.foo).toBe(`foo-value`)
      expect(parsed.bar).toBe(undefined)
    })

    it('should use the passed in arg over the env if both are set', async () => {
      process.env.TEST_FOO_ENV_VALUE = `foo-value`

      const parsed = await argsParse({
        args: [`foo=override-value`],
        task: testTask6,
      })
  
      expect(parsed.foo).toBe(`override-value`)
    })

    it('should use the env over a default value', async () => {
      process.env.TEST_FOO_ENV_VALUE = `foo-value`
      process.env.TEST_NUM_ENV_NUM = `341`

      const parsed = await argsParse({
        args: [],
        task: testTask6,
      })
  
      expect(parsed.num).toBe(341)
    })

    it('should use the passed in arg when env and default exist', async () => {
      process.env.TEST_FOO_ENV_VALUE = `foo-value`
      process.env.TEST_NUM_ENV_NUM = `341`

      const parsed = await argsParse({
        args: [`num=222`],
        task: testTask6,
      })
  
      expect(parsed.num).toBe(222)
    })

  })

})
