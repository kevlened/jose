import * as jwt from 'jwt-lite';
import fetch from 'isomorphic-unfetch';

function promiseMutex(fn) {
  const queue = [];
  function flush() {
    if (!queue.length) return;
    const pair = queue.shift();
    fn.apply(null, pair[0])
    .then(res => pair[1](null, res), pair[1])
    .then(flush);
  }
  return function() {
    return new Promise((resolve, reject) => {
      queue.push([
        arguments,
        (err, res) => err ? reject(err) : resolve(res)
      ]);
      if (queue.length === 1) flush();
    });
  }
}

const safeGetWellKnown = promiseMutex(verifier =>
  verifier._wellKnown ?
    Promise.resolve(verifier._wellKnown) :
    fetch(`${verifier.issuer}/.well-known/openid-configuration`)
    .then(res => res.json())
    .then(json => verifier._wellKnown = json)
);

function getWellKnown(verifier) {
  return verifier._wellKnown ?
    Promise.resolve(verifier._wellKnown) :
    safeGetWellKnown(verifier)
}

function shouldReuseKeys(verifier, force) {
  const sinceLastUpdate = Date.now() - verifier._lastKeysUpdate;
  if (force) {
    return sinceLastUpdate < verifier.minKeysLifespan;
  }
  return !!verifier._keys && sinceLastUpdate < verifier.maxKeysLifespan;
}

const safeGetKeys = promiseMutex((verifier, force) => {
  if (shouldReuseKeys(verifier, force)) {
    return Promise.resolve(verifier._keys);
  }
  return getWellKnown(verifier)
  .then(wellKnown => fetch(wellKnown.jwks_endpoint))
  .then(res => res.json())
  .then(json => {
    verifier._lastKeysUpdate = Date.now();
    return verifier._keys = json.keys
  });
});

function getKeys(verifier, force) {
  if (shouldReuseKeys(verifier, force)) {
    return Promise.resolve(verifier._keys);
  }
  return safeGetKeys(verifier, force);
}

function findKey(keys, kid) {
  let k = keys.length;
  while (k--) {
    const key = keys[k];
    if (key.kid = kid) return key;
  }
}

function getKey(verifier, kid) {
  return getKeys(verifier)
    .then(keys => findKey(keys, kid))
    .then(key => key ?
      key :
      getKeys(verifier, true).then(keys => findKey(keys, kid))
    )
    .then(key => {
      if (key) return key;
      throw new Error('Unable to find key');
    });
}

export default class JwtVerifier {
  constructor(options = {}) {
    // TODO: do you have to provide issuer or keys
    if (!options.issuer && !options.keys) {
      throw new Error('Must provide an issuer or keys');
    }
    if (options.keys) {
      this._keys = options.keys;
      options.maxKeysLifespan = Infinity;
      options._lastKeysUpdate = 0;
      delete options.keys;
    }
    Object.assign(this, {
      minKeysLifespan: 60 * 1000,
      maxKeysLifespan: 15 * 60 * 1000
    }, options);
  }

  /**
   * Verify a token
   * @param {string} token
   * @param {object=} options
   * @return {object}
   */
  verify(token, options) {
    let opts = [
      'algorithms',
      'issuer',
      'subject',
      'audience',
      'clockSkew',
      'time'
    ].reduce((agg, val) => {
      agg[val] = this[val]
      return agg
    }, {});
    opts = Object.assign(opts, options);
    return new Promise(resolve => resolve(jwt.decode(token)))
    .then(decoded => {
      if (!decoded.header.kid) {
        throw new Error('A kid must be present in the JWT header');
      }
      return getKey(this, decoded.header.kid);
    })
    .then(key => jwt.verify(token, key, options));
  }
};
