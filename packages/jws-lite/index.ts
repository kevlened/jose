import crypto from 'isomorphic-webcrypto'
import * as algos from 'jose-algorithms'
import * as jwk from 'jwk-lite'
import { toBase64Url, fromBase64Url } from 'b64u-lite';
import { toUint8Array, fromUint8Array } from 'str2buf'

/**
 * Decode a token
 * @param {string} token
 * @param {object} options
 * @param {boolean=} options.complete
 * @return {string | {header: object, payload: string, signedContent: Uint8Array, signature: Uint8Array}}
 */
export function decode(token = '', { complete }) {
  const parts = token.split('.')
  if (parts.length !== 3) throw new Error('token must have 3 parts')
  if (!complete) return fromBase64Url(parts[1])
  return {
    header: JSON.parse(fromBase64Url(parts[0])),
    payload: fromBase64Url(parts[1]),
    signedContent: toUint8Array(parts[0] + '.' + parts[1]),
    signature: toUint8Array(fromBase64Url(parts[2]))
  }
}

/**
 * Sign a payload with a key
 * @param {string} payload
 * @param {object} key 
 * @param {object=} options
 * @return {string}
 */
export function sign(payload, key, { alg }) {
  return new Promise(resolve => {
    if (!algos[alg]) throw new Error(`alg must be one of ${Object.keys(algos)}`)
    resolve(toBase64Url({ alg }) + '.' + toBase64Url(payload))
  })
  .then(payloadString => {
    const buffer = toUint8Array(payloadString)
    return jwk.importKey(key, alg)
    .then(signingKey => {
      const algo = Object.assign({}, algos[alg])
      delete algo.namedCurve
      return crypto.subtle.sign(
        algo,
        signingKey,
        buffer
      )
    })
    .then(signature =>
      payloadString + '.' + toBase64Url(fromUint8Array(signature)))
  })
}

/**
 * Verify a payload with a key
 * @param {string} token
 * @param {object} key 
 * @param {object} options
 * @return {string}
 */
export function verify(token, key, { algorithms }) {
  return new Promise(resolve => {
    resolve(decode(token, { complete: true }))
  })
  .then(jws => {
    if (algorithms && !algorithms.includes(jws.header.alg))
      throw new Error(`alg must be one of ${algorithms}`)
    if (!algos[jws.header.alg])
      throw new Error(`alg must be one of ${Object.keys(algos)}`)
    return jwk.importKey(key, jws.header.alg)
    .then(verifyingKey => crypto.subtle.verify(
      algos[jws.header.alg],
      verifyingKey,
      jws.signature,
      jws.signedContent
    ))
    .then(result => {
      if (!result) throw new Error('invalid token signature')
      return jws.payload
    })
  })
}
