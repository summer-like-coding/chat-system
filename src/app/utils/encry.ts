/**
 * 加密和解密
 * @description 使用TweetNaCl.js库进行加密和解密
 */
import { message } from 'antd'
import nacl from 'tweetnacl'
import util from 'tweetnacl-util'

// const keypair = nacl.box.keyPair() // 生成密钥对
// export const receiverPublicKey = util.encodeBase64(keypair.publicKey) // 公钥()
// export const receiverSecretKey = util.encodeBase64(keypair.secretKey) // 私钥

/**
 * 生成密钥对
 */
export function genderKeyPair() {
  const keypair = nacl.box.keyPair() // 生成密钥对
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
  if (!receiverPublicKey) {
    message.error('对方未设置公钥，无法加密,无法交流！')
    return null
  }
  const ephemeralKeyPair = nacl.box.keyPair()
  const pubKeyUInt8Array = util.decodeBase64(receiverPublicKey)
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

export function decrypt(receiverSecretKey: string, encryptedData: IEncryptedMsg) {
  const receiverSecretKeyUint8Array = util.decodeBase64(
    receiverSecretKey,
  )
  const nonce = util.decodeBase64(encryptedData.nonce)
  const ciphertext = util.decodeBase64(encryptedData.ciphertext)
  const ephemPubKey = util.decodeBase64(encryptedData.ephemPubKey)
  const decryptedMessage = nacl.box.open(
    ciphertext,
    nonce,
    ephemPubKey,
    receiverSecretKeyUint8Array,
  )
  if (!decryptedMessage)
    return null
  return util.encodeUTF8(decryptedMessage!)
}
