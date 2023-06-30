import { String as StringUtils } from './string-utils'

function createAppend(s: string) {
  const container = document.createDocumentFragment()
  container.appendChild(document.createTextNode(s))

  return container
}

/**
 * @param {string} format
 * @param {!Array.<!SDK.RemoteObject>} parameters
 * @param {!Element} formattedResult
 */
export default function formatWithSubstitutionString(
  format: any,
  parameters: any,
  formattedResult: any
) {
  const formatters: any = {}

  function stringFormatter(obj: any) {
    if (typeof obj !== 'string') {
      return ''
    }

    return String(obj)
  }

  function floatFormatter(obj: any) {
    if (typeof obj !== 'number') return 'NaN'
    return obj
  }

  function integerFormatter(obj: any) {
    if (typeof obj !== 'number') return 'NaN'
    return Math.floor(obj)
  }

  let currentStyle: any = null
  function styleFormatter(obj: any) {
    currentStyle = {}
    const buffer = document.createElement('span')
    buffer.setAttribute('style', obj)
    for (let i = 0; i < buffer.style.length; i++) {
      const property = buffer.style[i]
      if (isWhitelistedProperty(property))
        currentStyle[property] = buffer.style[property]
    }
  }

  function isWhitelistedProperty(property: string) {
    const prefixes = [
      'background',
      'border',
      'color',
      'font',
      'line',
      'margin',
      'padding',
      'text',
      '-webkit-background',
      '-webkit-border',
      '-webkit-font',
      '-webkit-margin',
      '-webkit-padding',
      '-webkit-text'
    ]
    for (let i = 0; i < prefixes.length; i++) {
      if (property.startsWith(prefixes[i])) return true
    }
    return false
  }

  formatters.s = stringFormatter
  formatters.f = floatFormatter
  // Firebug allows both %i and %d for formatting integers.
  formatters.i = integerFormatter
  formatters.d = integerFormatter

  // Firebug uses %c for styling the message.
  formatters.c = styleFormatter

  function append(a: any, b: any) {
    if (b instanceof Node) {
      a.appendChild(b)
    } else if (typeof b !== 'undefined') {
      let toAppend: any = createAppend(String(b))

      if (currentStyle) {
        let wrapper = document.createElement('span')
        wrapper.appendChild(toAppend)
        applyCurrentStyle(wrapper)
        for (let i = 0; i < wrapper.children.length; ++i)
          applyCurrentStyle(wrapper.children[i])
        toAppend = wrapper
      }
      a.appendChild(toAppend)
    }
    return a
  }

  /**
   * @param {!Element} element
   */
  function applyCurrentStyle(element: any) {
    for (var key in currentStyle) element.style[key] = currentStyle[key]
  }

  // String.format does treat formattedResult like a Builder, result is an object.
  return StringUtils.format(
    format,
    parameters,
    formatters,
    formattedResult,
    append
  )
}
