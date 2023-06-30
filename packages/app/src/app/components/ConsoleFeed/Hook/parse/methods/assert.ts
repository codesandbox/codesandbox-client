export function test(expression: any, ...messages: any[]): any {
  if (expression) return false

  // Default message
  if (messages.length === 0) messages.push('console.assert')

  return {
    method: 'error',
    data: [`Assertion failed:`, ...messages]
  }
}
