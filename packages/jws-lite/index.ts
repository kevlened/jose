import * as crypto from 'isomorphic-webcrypto'
import * as algos from 'jose-algorithms'
import * as jwk from 'jwk-lite'

/**
 * Sign a payload with a key
 * @param {string} payload
 * @param {object} key 
 */
export function sign(payload, key, { alg }) {
  if (!alg) throw new Error('alg is required')
  return jwk.importKey(key, alg)
    .then(signingKey => {
      
    })
}

/**
 * Verify a payload with a key
 * @param {string} payload
 * @param {object} key 
 */
export function verify(payload, key) {

}
