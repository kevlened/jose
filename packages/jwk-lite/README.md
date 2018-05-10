# jwk-lite

## Install

`npm install jwk-lite`

## Usage

```javascript
const jwk = require('jwk-lite')

jwk.generateKey('HS256')
.then(keys => {
  console.log(keys.sharedKey)
})

jwk.generateKey('RS256')
.then(keys => {
  console.log(keys.publicKey)
  console.log(keys.privateKey)
})

jwk.generateKey('ES256')
.then(keys => {
  console.log(keys.publicKey)
  console.log(keys.privateKey)
})

jwk.exportKey(key)
.then(jsonJwk => console.log(jsonJwk))

jwk.import(jsonJwk)
.then(key => console.log(key))
```

## Can it be smaller?

If you use ES6 imports with a bundler that supports tree-shaking, yes!

```javascript
import { generateKey } from 'jwk-lite'
```

## License

MIT
