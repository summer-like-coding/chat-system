import process from 'node:process'
import { Connection } from 'rabbitmq-client'

export const rabbit = new Connection(process.env.RABBITMQ_URL)

rabbit.on('error', (err) => {
  console.error('[RabbitMQ] Connection error', err)
})
rabbit.on('connection', () => {
  console.warn('[RabbitMQ] Connection successfully established')
})

export const rabbitPublisher = rabbit.createPublisher({
  confirm: true,
  exchanges: [{ exchange: 'messages', type: 'topic' }],
  maxAttempts: 2,
})

async function onShutdown() {
  await rabbitPublisher.close()
  await rabbit.close()
}
process.on('SIGINT', onShutdown)
process.on('SIGTERM', onShutdown)
