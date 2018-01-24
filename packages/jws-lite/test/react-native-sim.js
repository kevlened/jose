const path = require('path');

global.isReactNativeSim = true;
global.window = {
  Uint8Array,
  Promise
};
function XMLHttpRequest() {}
XMLHttpRequest.prototype.getResponseHeader = function() {};
global.XMLHttpRequest = XMLHttpRequest;

var Module = require('module');
var originalRequire = Module.prototype.require;

Module.prototype.require = function(){
  const args = Array.from(arguments);

  // replace the isomorphic-webcrypto module with the react-native one
  if (args[0] === 'isomorphic-webcrypto') {
    const webcryptoPath = require.resolve(args[0]);
    args[0] = webcryptoPath.replace(path.basename(webcryptoPath), 'react-native.js');
  }

  // mock react-native-securerandom
  if (args[0] === 'react-native-securerandom') {
    return {
      generateSecureRandom(length) {
        const arr = new Uint8Array(length);
        while(length--) {
          arr[length] = Math.random();
        }
        return Promise.resolve(arr);
      }
    };
  }

  return originalRequire.apply(this, args);
};

require('./node');

