import OSS from 'ali-oss'
import process from 'node:process'

export const oss = new OSS({
  accessKeyId: process.env.OSS_ACCESS_KEY_ID!,
  accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET!,
  bucket: process.env.OSS_BUCKET!,
  region: process.env.OSS_REGION!,
})
