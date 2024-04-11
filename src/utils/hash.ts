import crypto from 'node:crypto'

export async function sha256(t: string) {
  return crypto.createHash('sha256').update(t).digest('base64url')
}
