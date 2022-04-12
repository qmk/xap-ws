import fastify from 'fastify'
import fastifyws from 'fastify-websocket'

import { usb } from './workers/'

import type { MessageEvent } from 'ws'
import type { SocketStream } from 'fastify-websocket'
import type { FastifyRequest, FastifyReply } from 'fastify'

const w = usb()

const app = fastify({ logger: true })
app.register(fastifyws)

const validSubprotocols: string[] = ['XAPWS1']

app.get('/ws', { websocket: true }, (connection: SocketStream, req: FastifyRequest) => {
  connection.socket.on('message', (message: MessageEvent) => {
    // Validate the sub-protocol
    const subprotocol = req.headers['sec-websocket-protocol'] || ''
    if (!validSubprotocols.includes(subprotocol)) {
      connection.socket.send('Unsupported Protocol')
      connection.socket.close()
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
