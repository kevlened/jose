export const HS256 = { name: 'HMAC', hash: { name: 'SHA-256' }}
export const HS384 = { name: 'HMAC', hash: { name: 'SHA-384' }}
export const HS512 = { name: 'HMAC', hash: { name: 'SHA-512' }}
export const RS256 = { name: 'RSASSA-PKCS1-v1_5', hash: { name: 'SHA-256' }}
export const RS384 = { name: 'RSASSA-PKCS1-v1_5', hash: { name: 'SHA-384' }}
export const RS512 = { name: 'RSASSA-PKCS1-v1_5', hash: { name: 'SHA-512' }}
export const ES256 = { name: 'ECDSA', hash: { name: 'SHA-256' }, namedCurve: 'P-256' }
export const ES384 = { name: 'ECDSA', hash: { name: 'SHA-384' }, namedCurve: 'P-384' }
export const ES512 = { name: 'ECDSA', hash: { name: 'SHA-512' }, namedCurve: 'P-521' }