# Git-Lib
Wrapper around the node crypto

### Install
With **yarn**
```bash
yarn add @keg-hub/crypto-lib
```
With **npm**
```bash
npm install @keg-hub/crypto-lib
```

## Setup

## Example
```js
// Import the repo
const { crypto } = require('@keg-hub/crypto-lib')

// Encrypt a key
const encryptedKey = await crypto.encrypt(key, password)
// Decrypt a key
const originalKey = await crypto.decrypt(encryptedKey, password)

// Decrypted key will equal the original key
expect(key).toBe(originalKey)

```
