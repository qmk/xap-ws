import app from './app'
import tap from 'tap'

const { before, test, teardown } = tap

before(async () => {
  await app.listen(9999)
})

teardown(async () => {
  await app.close()
})

test('App: healthcheck', (t) => {
  t.plan(2)
  app.inject({ method: 'GET', url: '/health' }, (err, response) => {
    t.equal(err, null)
    t.equal(response.statusCode, 200)
  })
})
