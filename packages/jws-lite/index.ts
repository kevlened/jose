import crypto from 'isomorphic-webcrypto'
import * as algos from 'jose-algorithms'
import { importKey } from 'jwk-lite'
import { toBase64Url, fromBase64Url, toBinaryString, fromBinaryString } from 'b64u-lite'
import { toUint8Array, fromBuffer } from 'str2buf'

/**
 * Decode a token
 * @param {string} token
 * @return {header: object, payload: string, signedContent: Uint8Array, signature: Uint8Array}
 */
export function decode(token = '') {
  const parts = token.split('.')
  if (parts.length !== 3) throw new Error('token must have 3 parts')
  return {
    header: JSON.parse(fromBase64Url(parts[0])),
    payload: fromBase64Url(parts[1]),
    signedContent: toUint8Array(parts[0] + '.' + parts[1]),
    signature: toUint8Array(toBinaryString(parts[2]))
  }
}

/**
 * Sign a payload with a key
 * @param {string} payload
 * @param {object} key 
 * @param {object=} header
 * @return {string}
 */
export function sign(payload, key, header = {}) {
  let alg = header.alg;
  return new Promise(resolve => {
    header.alg = alg = alg || key.alg;
    if (!algos[alg]) throw new Error(`alg must be one of ${Object.keys(algos)}`)
    resolve(toBase64Url(JSON.stringify(header)) + '.' + toBase64Url(payload))
  })
  .then(payloadString => {
    const buffer = toUint8Array(payloadString)
    return importKey(key, { alg })
    .then(signingKey => {
      const algo = Object.assign({}, algos[alg])
      delete algo.namedCurve
      return crypto.subtle.sign(
        algo,
        signingKey,
        buffer
      )
    })
    .then(signature => payloadString + '.' + fromBinaryString(fromBuffer(signature)))
  })
}

/**
 * Verify a payload with a key
 * @param {string} token
 * @param {object} key 
 * @param {object} options
 * @return {string}
 */
export function verify(token, key, { algorithms } = {}) {
  algorithms = algorithms || Object.keys(algos)
  return new Promise(resolve => {
    resolve(decode(token))
  })
  .then(jws => {
    if (algorithms && !algorithms.includes(jws.header.alg))
      throw new Error(`alg must be one of ${algorithms}`)
    if (!algos[jws.header.alg])
      throw new Error(`alg must be one of ${Object.keys(algos)}`)
    return importKey(key, { alg: jws.header.alg })
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
