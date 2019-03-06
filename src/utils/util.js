/*eslint-disable*/
// import fun_aes from 'crypto-js/aes';
const fun_aes = require('./aes.js');
const key = fun_aes.CryptoJS.enc.Utf8.parse('1234567893214569'); // sdf678df786sfjfh
const iv = fun_aes.CryptoJS.enc.Utf8.parse('0123456789ABCDEF');

function AES_Encrypt(word) {
  const srcs = fun_aes.CryptoJS.enc.Utf8.parse(word);
  const encrypted = fun_aes.CryptoJS.AES.encrypt(srcs, key, {
    iv,
    mode: fun_aes.CryptoJS.mode.CBC,
    padding: fun_aes.CryptoJS.pad.Pkcs7
  });
  // const hexStr = encrypted.ciphertext.toString().toUpperCase();
  const hexStr = encrypted.ciphertext.toString();

  // console.log(`hexStr->${hexStr}`);
  const oldHexStr = fun_aes.CryptoJS.enc.Hex.parse(hexStr);
  // 将密文转为Base64的字符串
  // const base64Str = fun_aes.CryptoJS.enc.Base64.stringify(oldHexStr);
  // console.log(`base64Str->${base64Str}`);
  return oldHexStr;
}

function AES_Decrypt(word) {
  console.log(`word->${word}`);
  // 如果加密返回的base64Str
  const srcs = word;
  // 若上面加密返回的hexStr,需再次处理
  // var encryptedHexStr = fun_aes.CryptoJS.enc.Hex.parse(word);
  // var srcs = fun_aes.CryptoJS.enc.Base64.stringify(encryptedHexStr);

  const decrypt = fun_aes.CryptoJS.AES.decrypt(srcs, key, {
    iv,
    mode: fun_aes.CryptoJS.mode.CBC,
    padding: fun_aes.CryptoJS.pad.Pkcs7
  });
  const decryptedStr = decrypt.toString(fun_aes.CryptoJS.enc.Utf8);
  const value = decryptedStr.toString();
  console.log(`value->${value}`);
  return value;
}

function Base64_Encode(word) {
  const str = fun_base64.Base64_Encode(word);
  return str;
}

module.exports = {
  AES_Encrypt,
  AES_Decrypt,
};
