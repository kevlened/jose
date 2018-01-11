import crypto from 'isomorphic-webcrypto'
import * as algos from 'jose-algorithms'

/**
 * Generate a jwk or key pair
 * @param {object} json 
 * @param {string} alg 
 * @param {object=} options
 */
export function generateKey(alg, {
  modulusLength,
  publicExponent,
  usages = ['sign', 'verify'],
  extractable = true
}) {
  if (!algos[alg]) throw new Error(`alg must be one of ${Object.keys(algos)}`)
  const algo = Object.assign({}, algos[alg])

  if (algo.name === 'RSASSA-PKCS1-v1_5') {
    algo.modulusLength = modulusLength || 2048
    algo.publicExponent = publicExponent || new Uint8Array([0x01, 0x00, 0x01]) // 65537
  }

  if (algo.name === 'ECDSA') {
    delete algo.hash
  }

  return crypto.subtle.generateKey(
    algo,
    extractable,
    usages
  )
  .then(keys => {
    if (!keys.publicKey) {
      return { sharedKey: keys }
    }
    return keys
  })
  .catch(e => {
    throw new Error(`couldn't generate key: ${e.message}`)
  })
}

/**
 * Import a jwk from a JSON object
 * @param {object} json 
 * @param {string} alg 
 * @param {object=} options
 * @param {boolean} [options.extractable=false]
 * @param {string[]} [options.usages=["sign","verify"]]
 */
export function importKey(json, alg, {
  extractable,
  usages = ['sign', 'verify']
}) {
  if (!json) throw new Error('jwk must be an object')
  if (!algos[alg]) throw new Error(`alg must be one of ${Object.keys(algos)}`)
  
  let algo = Object.assign({}, algos[alg])
  if (json.kty === 'EC') {
    algo.namedCurve = json.crv
    delete algo.hash
  }

  // IE11 fix (should be added to webcrypto-shim)
  // https://connect.microsoft.com/IE/feedback/details/2242108/webcryptoapi-importing-jwk-with-use-field-fails
  if (global.msCrypto) {
    json = Object.assign({}, json)
    delete json.use
  }

  return crypto.subtle.importKey(
    'jwk', // format
    json,
    algo,
    !!extractable,
    usages
  )
  .catch(e => {
    throw new Error(`couldn't import key: ${e.message}`)
  })
}

/**
 * Export a jwk as a JSON object
 * @param key 
 */
export function exportKey(key) {
  let exportPromise

  // HMAC only returns a sharedKey
  if (key.algorithm && key.algorithm.name === 'HMAC') {
    exportPromise = crypto.subtle.exportKey('jwk', key)
    .then(sharedKey => { return { sharedKey }})

  // Everything else returns a public and private key
  } else {
    exportPromise = Promise.all([
      crypto.subtle.exportKey('jwk', key.publicKey),
      crypto.subtle.exportKey('jwk', key.privateKey)
    ])
    .then((keys = []) => {
      return {
        publicKey: keys[0],
        privateKey: keys[1]
      }
    })
  }

  return exportPromise
  .catch(e => {
    throw new Error(`couldn't export key: ${e.message}`)
  })
}
