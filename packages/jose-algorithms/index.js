module.exports = {
  HS256: { name: 'HMAC', hash: { name: 'SHA-256' }},
  HS384: { name: 'HMAC', hash: { name: 'SHA-384' }},
  HS512: { name: 'HMAC', hash: { name: 'SHA-512' } },
  PS256: { name: 'RSA-PSS', hash: { name: 'SHA-256' }, saltLength: 32 },
  PS384: { name: 'RSA-PSS', hash: { name: 'SHA-384' }, saltLength: 48 },
  PS512: { name: 'RSA-PSS', hash: { name: 'SHA-512' }, saltLength: 64 },
  RS256: { name: 'RSASSA-PKCS1-v1_5', hash: { name: 'SHA-256' }},
  RS384: { name: 'RSASSA-PKCS1-v1_5', hash: { name: 'SHA-384' }},
  RS512: { name: 'RSASSA-PKCS1-v1_5', hash: { name: 'SHA-512' }},
  ES256: { name: 'ECDSA', hash: { name: 'SHA-256' }, namedCurve: 'P-256' },
  ES384: { name: 'ECDSA', hash: { name: 'SHA-384' }, namedCurve: 'P-384' },
  ES512: { name: 'ECDSA', hash: { name: 'SHA-512' }, namedCurve: 'P-521' },
}
