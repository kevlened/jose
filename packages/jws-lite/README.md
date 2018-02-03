# jws-lite

## Install

`npm install jws-lite`

## Usage

```javascript
const jws = require('jws-lite')

const decoded = jws.decode('someJWS');
const {
  header,         // jose header
  payload,        // payload as a binary string
  signedContent,  // UintArray of the signed content
  signature       // UintArray of the signature
} = decoded;

jws.sign(payload, jwk)
.then(jwsToken => console.log(jwsToken))

jws.verify(jwsToken, jwk)
.then(payload => console.log(payload))
```

## Can it be smaller?

If you use ES6 imports with a bundler that supports tree-shaking, yes!

```javascript
import { sign } from 'jws-lite'
```

## License

MIT
