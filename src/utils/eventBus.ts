import mitt from 'mitt'

export const emitter = mitt<{
  hello: string
}>()
