import tap from 'tap'
import proxyquire from 'proxyquire'
import * as Sinon from 'sinon'

import type { Response } from 'light-my-request'

const { before, test, teardown } = tap

const app = proxyquire('./app', {
  './workers/getter': {
    usb: Sinon.stub().returns({
      performance: {
        eventLoopUtilization: () => ({})
      }
    })
  }
}).default

before(async () => {
  await app.listen(9999)
})

teardown(async () => {
  await app.close()
})

test('App: healthcheck', (t) => {
  t.plan(2)
  app.inject({ method: 'GET', url: '/health' }, (err: Error, response: Response) => {
    t.equal(err, null)
    t.equal(response.statusCode, 200)
  })
})
