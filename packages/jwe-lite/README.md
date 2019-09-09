# jwe-lite

## Install

`npm install jwe-lite`

## Usage

```javascript
const jwe = require('jwe-lite')

const decoded = jwe.decode('somejwe');
const {
  header,            // jose header
  key,               // encrypted key
  iv,                // initialization vector
  encryptedContent,  // UintArray of the encrypted content
  tag                // UintArray of the authentication tag
} = decoded;

jwe.encrypt(payload, jwk)
.then(jweToken => console.log(jweToken))

jwe.decrypt(jweToken, jwk)
.then(payload => console.log(payload))
```

## Can it be smaller?

If you use ES6 imports with a bundler that supports tree-shaking, yes!

```javascript
import { encrypt } from 'jwe-lite'
```

## License

MIT
