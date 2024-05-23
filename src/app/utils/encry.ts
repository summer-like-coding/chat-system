/* eslint-disable no-console */
/**
 * 加密和解密
 * @description 使用TweetNaCl.js库进行加密和解密
 */

import nacl from 'tweetnacl'
import util from 'tweetnacl-util'

/**
 * 生成密钥对
 */
export function genderKeyPair() {
  const keypair = nacl.box.keyPair() // 生成密钥对
  // 判断生成的密钥对是否正确，是否为Uint8Array类型
  console.log('公钥长度:', keypair.publicKey.length) // 打印公钥长度
  console.log('私钥长度:', keypair.secretKey.length) // 打印私钥长度
  return {
    ownPublicKey: util.encodeBase64(keypair.publicKey), // 公钥()
    ownSecretKey: util.encodeBase64(keypair.secretKey), // 私钥
  }
}

/* encrypted message interface */
interface IEncryptedMsg {
  ciphertext: string
  ephemPubKey: string
  nonce: string
  version: string
}
/**
 * 加密
 * @param receiverPublicKey ；接收者的公钥
 * @param msgParams：要加密的消息
 * @returns
 */
export function encrypt(receiverPublicKey: string, msgParams: string) {
  const ephemeralKeyPair = nacl.box.keyPair()
  const pubKeyUInt8Array = util.decodeBase64(receiverPublicKey)
  console.log('公钥长度:', pubKeyUInt8Array.length)

  const msgParamsUInt8Array = util.decodeUTF8(msgParams)
  const nonce = nacl.randomBytes(nacl.box.nonceLength)
  const encryptedMessage = nacl.box(
    msgParamsUInt8Array,
    nonce,
    pubKeyUInt8Array,
    ephemeralKeyPair.secretKey,
  )
  return {
    ciphertext: util.encodeBase64(encryptedMessage), // 加密后的消息
    ephemPubKey: util.encodeBase64(ephemeralKeyPair.publicKey), // 临时公钥
    nonce: util.encodeBase64(nonce), // 服务端生成的随机数
    version: 'x25519-xsalsa20-poly1305',
  }
}

/**
 *
 * @param receiverSecretKey 私钥
 * @param encryptedData
 * @returns
 */

export function decrypt(
  receiverSecretKey: string,
  encryptedData: IEncryptedMsg,
  ownSecretKey: string,
) {
  console.log('receiverSecretKey', receiverSecretKey)
  console.log('ownSecretKey', ownSecretKey)

  const receiverSecretKeyUint8Array = util.decodeBase64(
    receiverSecretKey,
  )
  const ownSecretKeyUint8Array = util.decodeBase64(ownSecretKey)
  console.log('私钥长度', receiverSecretKeyUint8Array.length)

  const nonce = util.decodeBase64(encryptedData.nonce)
  const ciphertext = util.decodeBase64(encryptedData.ciphertext)
  const ephemPubKey = util.decodeBase64(encryptedData.ephemPubKey)
  const decryptedMessage = nacl.box.open(
    ciphertext,
    nonce,
    ephemPubKey,
    receiverSecretKeyUint8Array,
  )
  const decryptedMessageOwn = nacl.box.open(
    ciphertext,
    nonce,
    ephemPubKey,
    ownSecretKeyUint8Array,
  )
  console.log('decryptedMessage', decryptedMessage)

  if (!decryptedMessage && !decryptedMessageOwn)
    return null

  return decryptedMessage ? util.encodeUTF8(decryptedMessage) : util.encodeUTF8(decryptedMessageOwn!)
}
