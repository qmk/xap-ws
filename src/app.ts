import fastify from 'fastify'
import fastifyws from 'fastify-websocket'

import { usb } from './workers/'
import { IncomingMessageValidate } from './schemas'
import { tryParse } from './utils'
import type { MessageEvent } from 'ws'
import type { SocketStream } from 'fastify-websocket'
import type { FastifyRequest, FastifyReply } from 'fastify'
import { IncomingMessage } from 'schemas/incoming-message'

const w = usb()

const app = fastify({ logger: { level: 'debug' } })
app.register(fastifyws)

app.get('/ws', { websocket: true }, (connection: SocketStream, req: FastifyRequest) => {
  connection.socket.on('message', (message: MessageEvent) => {
    const parsed = tryParse<IncomingMessage>(message.toString())
    if (!parsed || !IncomingMessageValidate(JSON.parse(message.toString()))) {
      IncomingMessageValidate.errors && req.log.debug(IncomingMessageValidate.errors)
      connection.socket.send(JSON.stringify({ error: 'Unsupported message' }))
      return
    }
    w.postMessage(message.toString())
    w.once('message', (result) => {
      req.log.info(result)
      connection.socket.send(result)
    })
    w.on('error', (err) => {
      req.log.error(err)
      connection.socket.send(err.toString())
      process.exit(1)
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
