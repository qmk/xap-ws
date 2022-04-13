class WsError extends Error {
  // placeholder
}

export class UnsupportedMessage extends WsError {
  private readonly error: string = 'Unsupported message'
  constructor(msg?: string) {
    super(msg)
  }
  toString() {
    return JSON.stringify(this)
  }
}
