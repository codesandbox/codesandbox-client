import * as React from 'react'
import Linkify from 'linkifyjs/react'

function splitMessage(message: string): string {
  const breakIndex = message.indexOf('\n')
  // consider that there can be line without a break
  if (breakIndex === -1) {
    return message
  }
  return message.substr(0, breakIndex)
}

function ErrorPanel({ error }: { error: string }) {
  /* This checks for error logTypes and shortens the message in the console by wrapping
  it a <details /> tag and putting the first line in a <summary /> tag and the other lines
  follow after that. This creates a nice collapsible error message */
  let otherErrorLines
  const firstLine = splitMessage(error)
  const msgArray = error.split('\n')
  if (msgArray.length > 1) {
    otherErrorLines = msgArray.slice(1)
  }

  if (!otherErrorLines) {
    return <Linkify>{error}</Linkify>
  }

  return (
    <details>
      <summary style={{ outline: 'none', cursor: 'pointer' }}>
        {firstLine}
      </summary>
      <Linkify>{otherErrorLines.join('\n\r')}</Linkify>
    </details>
  )
}

export default ErrorPanel
