import { Buffer } from 'node:buffer'

export function hex2Buffer(hex: string) {
  return Buffer.from(hex, 'hex')
}

export function buffer2Hex(buffer: Buffer) {
  return buffer.toString('hex')
}
