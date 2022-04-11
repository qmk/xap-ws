import fastify from 'fastify'

import type { MessageEvent } from 'ws'
import type { SocketStream } from 'fastify-websocket'
import type { FastifyRequest, FastifyReply } from 'fastify'

const app = fastify({ logger: true })

app.get('/ws', { websocket: true }, (connection: SocketStream, req: FastifyRequest) => {
  connection.socket.on('message', (message: MessageEvent) => {
    connection.socket.send('hi from server')
    req.log.info(message.toString())
  })
})

app.get('/health', {}, (_req: FastifyRequest, reply: FastifyReply) => {
  reply.send('ok')
})

if (require.main === module) {
  app.listen(3002, '0.0.0.0', (err) => {
    if (err) console.error(err)
  })
}

export default app
