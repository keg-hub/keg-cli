const { addToProcess, addParam, addFlag, addValues } = require('../arguments')

describe('addParam', () => {
  it('should return a key value pair', () => {
    expect(
      addParam('foo', 2)
    ).toEqual('--foo 2')

    expect(
      addParam('foo', 0)
    ).toEqual('--foo 0')

  })

  it ('should return empty string for no value', () => {
    expect(
      addParam('foo', undefined)
    ).toEqual('')
  })
})


describe('addFlag', () => {
  it('should return a flag string for non-existent or truthy values', () => {
    expect(
      addFlag('foo', true)
    ).toEqual('--foo')

    expect(
      addFlag('foo', 'bar')
    ).toEqual('--foo')

    expect(
      addFlag('foo')
    ).toEqual('--foo')

  })

  it('should return empty string for falsy values', () => {

    expect(
      addFlag('foo', false)
    ).toEqual('')

    expect(
      addFlag('foo', undefined)
    ).toEqual('')

    expect(
      addFlag('foo', null)
    ).toEqual('')

    expect(
      addFlag('foo', 0)
    ).toEqual('')

  })
})

describe('addValues', () => {
  it('should work with arrays', () => {
    expect(
      addValues(['foo','bar'])
    ).toEqual('foo bar')
  })

  it ('should work for string input', () => {
    expect(
      addValues('foo,bar,baz')
    ).toEqual('foo bar baz')
  })

  it('should return empty string for everything else', () => {
    expect(
      addValues(22)
    ).toEqual('')
  })
})

describe('addToProcess', () => {
  it('should add envs to the current process', () => {
    expect(process.env.__TEST_ADD_ENV).toBe(undefined)
    addToProcess({__TEST_ADD_ENV: 'test add env'})
    expect(process.env.__TEST_ADD_ENV).toBe(`test add env`)
  })

  it('should not add envs if if already exists', () => {
    process.env.__TEST_ADD_ENV = `no overwrite env`
    addToProcess({__TEST_ADD_ENV: 'test add env'})
    expect(process.env.__TEST_ADD_ENV).toBe(`no overwrite env`)
  })

  it('should overwrite envs if the second argument is true', () => {
    process.env.__TEST_ADD_ENV = `no overwrite env`
    addToProcess({__TEST_ADD_ENV: 'test add env'}, true)
    expect(process.env.__TEST_ADD_ENV).toBe('test add env')
  })
  
})
