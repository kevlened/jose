import {
  decode as jwsDecode,
  sign as jwsSign,
  verify as jwsVerify
} from 'jws-lite'

/**
 * Decode a token
 * @param {string} token
 * @return {header: object, claimsSet: string, signedContent: Uint8Array, signature: Uint8Array}
 */
export function decode(token) {
  const jwt = jwsDecode(token)
  jwt.claimsSet = JSON.parse(jwt.payload)
  delete jwt.payload
  return jwt
}

/**
 * Sign a claims set with a key
 * @param {object} claimsSet
 * @param {object} key 
 * @param {object=} options
 * @return {string}
 */
export function sign(claimsSet, key, { alg } = {}) {
  return jwsSign(JSON.stringify(claimsSet), key, { alg })
}

/**
 * Verify a payload with a key
 * @param {string} token
 * @param {object} key 
 * @param {object=} options
 * @return {object}
 */
export function verify(token, key, {
  algorithms,
  issuer,
  subject,
  audience,
  expiration,
  clockSkew = 0,
  time = Math.floor(Date.now()/1000)
} = {}) {
  return jwsVerify(token, key, { algorithms })
  .then(payload => {
    const claimsSet = JSON.parse(payload)

    audience = typeof audience === 'string' ? new RegExp(`^${audience}$`) : audience
    const aud = typeof claimsSet.aud === 'string' ? [claimsSet.aud] : claimsSet.aud
    if (audience && !aud.some(a => audience.test(a)))
      throw new Error('invalid audience')
    
    issuer = typeof issuer === 'string' ? new RegExp(`^${issuer}$`) : issuer
    if (issuer && !issuer.test(claimsSet.iss))
      throw new Error('invalid issuer')

    subject = typeof subject === 'string' ? new RegExp(`^${subject}$`) : subject
    if (subject && !subject.test(claimsSet.sub))
      throw new Error('invalid subject')

    if (claimsSet.nbf && (time + clockSkew) < claimsSet.nbf)
      throw new Error(`invalid before ${claimsSet.nbf}`)

    const exp = typeof expiration !== 'undefined' ? expiration : claimsSet.exp;
    if (claimsSet.exp && (time - clockSkew) > exp)
      throw new Error('expired token')

    return claimsSet
  })
}
