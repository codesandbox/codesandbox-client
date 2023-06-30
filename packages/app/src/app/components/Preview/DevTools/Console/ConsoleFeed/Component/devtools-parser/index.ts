import Linkify from 'linkifyjs/html'
import formatMessageString from './format-message'

/**
 * Formats a console log message using the Devtools parser and returns HTML
 * @param args The arguments passed to the console method
 */
function formatMessage(args: any[]): string {
  const formattedResult = document.createElement('span')

  formatMessageString(args[0], args.slice(1), formattedResult)

  return Linkify(formattedResult.outerHTML.replace(/(?:\r\n|\r|\n)/g, '<br />'))
}

export default formatMessage
