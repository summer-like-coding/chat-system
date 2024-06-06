import process from 'node:process'
import { createClient } from 'redis'

export const redisClient = createClient({
  url: process.env.REDIS_URL,
})

redisClient.on('error', err => console.error('[Redis] client error:', err))
if (!process.env.NEXT_PHASE) {
  await redisClient.connect()
}
else {
  console.warn('[Redis] building now, skip connecting!')
}

async function onShutdown() {
  await redisClient.quit()
}
process.on('SIGINT', onShutdown)
process.on('SIGTERM', onShutdown)
