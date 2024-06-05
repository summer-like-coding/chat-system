import process from 'node:process'
import { Connection } from 'rabbitmq-client'

export const rabbit = new Connection(process.env.RABBITMQ_URL)

rabbit.on('error', (err) => {
  console.error('[RabbitMQ] Connection error', err)
})
rabbit.on('connection', () => {
  console.warn('[RabbitMQ] Connection successfully established')
})

export const rabbitPublisher = rabbit.createPublisher({ // 创建一个发布者
  confirm: true, // 确认模式
  exchanges: [{ exchange: 'messages', type: 'topic' }],
  maxAttempts: 2, // 最大尝试次数
})

async function onShutdown() {
  await rabbitPublisher.close()
  await rabbit.close()
}
process.on('SIGINT', onShutdown) // 退出信号
process.on('SIGTERM', onShutdown) // 终止信号
