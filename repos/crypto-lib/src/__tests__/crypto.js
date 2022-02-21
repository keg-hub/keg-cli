jest.resetAllMocks()
jest.clearAllMocks()

const key = '12345-test-key'
const pass = `test-password`

const { encrypt, decrypt } = require('../crypto')

describe('crypto', () => {

  test(`Should encrypt the passed in key`, async () => {
    const encrypted = await encrypt(key, pass)
    expect(encrypted).not.toEqual(key)
  })

  test(`Should encrypt with out a password`, async () => {
    const encrypted = await encrypt(key)
    expect(encrypted).not.toEqual(key)
  })

  test(`Should decrypt a key with a valid password`, async () => {
    const encrypted = await encrypt(key, pass)
    const decrypted = await decrypt(encrypted, pass)
    expect(decrypted).toEqual(key)
  })

  test(`Should not decrypt a key with invalid password`, async () => {
    const encrypted = await encrypt(key, pass)
    try {
      await decrypt(encrypted, `invalid-key`)
    }
    catch(err){
      expect(err.code).toBe(`ERR_OSSL_EVP_BAD_DECRYPT`)
    }
  })

})