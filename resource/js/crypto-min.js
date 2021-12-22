const cryptoJS = require('./crypto/crypto');
const AES = cryptoJS.AES;
const enc = cryptoJS.enc;
const mode = cryptoJS.mode;
const pad = cryptoJS.pad;
const project = require('@/../project');
const PWD = project.CLIENT_PASSWORD;
const IV = project.CLIENT_IV;

let transform = function (word) {
  //如果传入的是json，则先进行处理
  let type = typeof word;
  switch( type.toLowerCase() ) {
    case 'string': return word;
    case 'object': return JSON.stringify(word);
  }
};

function isJSON(word) {
  let isJson;
  try {isJson = typeof JSON.parse(word) === 'object'}
  catch(e) {
    isJson = false
  }
  return isJson
}

let decrypt = function (word, key, iv) {
  if(!word) {
    console.error('非法的对象或字符串');
    return;
  }
  word = transform(word);
  key = enc.Utf8.parse(key); //十六位十六进制数作为秘钥
  iv = enc.Utf8.parse(iv); //十六位十六进制数作为秘钥偏移量
  //解密方法
  let encryptedHexStr = enc.Hex.parse(word);
  let srcs = enc.Base64.stringify(encryptedHexStr);
  let decrypt = AES.decrypt(srcs, key, { iv: iv, mode: mode.CBC, padding: pad.Pkcs7 });
  let decryptedStr = decrypt.toString(enc.Utf8);
  let data = decryptedStr.toString();
  if(isJSON(data)) {
    return JSON.parse(data);
  } else {
    return data;
  }
};

let encrypt = function (word, key, iv) {
  if(!word) {
    console.error('非法的对象或字符串');
    return;
  }
  word = transform(word);
  key = enc.Utf8.parse(key); //十六位十六进制数作为秘钥
  iv = enc.Utf8.parse(iv); //十六位十六进制数作为秘钥偏移量
  //加密方法
  let srcs = enc.Utf8.parse(word);
  let encrypted = AES.encrypt(srcs, key, { iv: iv, mode: mode.CBC, padding: pad.Pkcs7 });
  return encrypted.ciphertext.toString().toUpperCase();
};

const crypto = {
  install(Vue) {
    Vue.crypto = {
      service: {
        encrypt,
        decrypt
      },
      client: {
        decrypt (word) {
          return decrypt(word, PWD, IV);
        },
        encrypt (word) {
          return encrypt(word, PWD, IV);
        }
      }
    }

    Vue.mixin({
      created: function () {
        this.crypto = Vue.crypto
      }
    })
  }
}

export default crypto

export const install = crypto.install;
