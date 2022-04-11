import { parentPort, isMainThread } from 'worker_threads'
import HID from 'node-hid'

import type { communicationMessage } from '../communication'

function list() {
  return JSON.stringify(HID.devices())
}

if (!isMainThread) {
  parentPort?.on('message', (message: communicationMessage) => {
    let result
    switch (message) {
      case 'list':
        result = list()
        break
      default:
        result = 'Not implemented'
    }
    parentPort?.postMessage(result)
  })
}
