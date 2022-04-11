import { Worker } from 'worker_threads'
import { join } from 'node:path'
import fastify from 'fastify'
import fastifyws from 'fastify-websocket'

import type { MessageEvent } from 'ws'
import type { SocketStream } from 'fastify-websocket'
import type { FastifyRequest, FastifyReply } from 'fastify'

const w = new Worker(join(__dirname, 'workers/usb.js'))

const app = fastify({ logger: true })
app.register(fastifyws)

app.get('/ws', { websocket: true }, (connection: SocketStream, req: FastifyRequest) => {
  connection.socket.on('message', (message: MessageEvent) => {
    w.postMessage(message.toString())
    w.once('message', (result) => {
      req.log.info(result)
      connection.socket.send(result)
    })
    w.on('error', (err) => {
      req.log.error(err)
      connection.socket.send(err)
    })
  })
})

app.get('/health', {}, (req: FastifyRequest, reply: FastifyReply) => {
  req.log.info(w.performance.eventLoopUtilization())
  reply.send('ok')
})

if (require.main === module) {
  app.listen(3002, '0.0.0.0', (err) => {
    if (err) console.error(err)
  })
}

export default app
