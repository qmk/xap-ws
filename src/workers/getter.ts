import { Worker } from 'node:worker_threads'
import { join } from 'node:path'
export function usb() {
  return new Worker(join(__dirname, 'usb.js'))
}
