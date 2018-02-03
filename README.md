# jose
Collection of JSON Web libraries

* [jose-algorithms](packages/jose-algorithms) - A collection of JOSE-compatible algorithms
* [jwk-lite](packages/jwk-lite) - isomorphic library to generate, import, and export JSON Web Keys
* [jws-lite](packages/jws-lite) - isomorphic library to decode, sign, and verify JSON Web Signatures
* [jwt-lite](packages/jwt-lite) - isomorphic library to decode, sign, and verify JSON Web Tokens

## Compatibility

All libraries should be compatible with Node.js, IE11+ and React Native. Some JOSE algorithms
will not work in some environments due to lack of support in the underlying WebCrypto libraries.

## License

MIT
