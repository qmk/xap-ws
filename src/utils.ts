export function tryParse<T>(input: string): T | undefined {
  try {
    return JSON.parse(input)
  } catch {
    return undefined
  }
}
