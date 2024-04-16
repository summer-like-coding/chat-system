import type { Message } from '@prisma/client'

import mitt from 'mitt'

export const emitter = mitt<{
  hello: string
  imMessage: Message
}>()
