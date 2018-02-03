const path = require('path');

global.isReactNativeSim = true;
global.window = {
  Uint8Array,
  Promise
};
function XMLHttpRequest() {}
XMLHttpRequest.prototype.getResponseHeader = function() {};
global.XMLHttpRequest = XMLHttpRequest;

delete global.Buffer;

const Module = require('module');
const originalRequire = Module.prototype.require;

Module.prototype.require = function(){
  const args = Array.from(arguments);

  // replace the isomorphic-webcrypto module with the react-native one
  if (args[0] === 'isomorphic-webcrypto') {
    const webcryptoPath = require.resolve(args[0]);
    args[0] = webcryptoPath.replace(path.basename(webcryptoPath), 'react-native.js');
  }

  if (args[0] === 'b64-lite') {
    const b64Path = require.resolve(args[0]);
    args[0] = path.resolve(path.dirname(b64Path), '../dist/react-native.js');
  }

  if (args[0] === 'str2buf') {
    const b64Path = require.resolve(args[0]);
    args[0] = path.resolve(path.dirname(b64Path), '../dist/str2buf.js');
  }

  return originalRequire.apply(this, args);
};

require('./node');
