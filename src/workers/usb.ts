import { parentPort, isMainThread } from 'worker_threads'

function process(input: string) {
  return `${input}666`
}

if (!isMainThread) {
  parentPort?.on('message', (message) => {
    parentPort?.postMessage(process(message))
  })
}
