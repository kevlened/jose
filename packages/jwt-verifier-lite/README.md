# jwt-verifier-lite

## Install

`npm install jwt-verifier-lite`

## Usage

```javascript
const JwtVerifier = require('jwt-verifier-lite')

const verifier = new JwtVerifier({
  issuer: 'https://www.example.com'
});

verifier.verify(jwtToken)
.then(claimsSet => console.log(claimsSet))
```

## License

MIT
