// Sandbox HTML elements
let sandbox: Document
function getSandbox() {
  return (sandbox ||= document.implementation.createHTMLDocument('sandbox'))
}

interface Storage {
  tagName: string
  attributes: {
    [attribute: string]: string
  }
  innerHTML: string
}

function objectifyAttributes(element: any) {
  const data = {}
  for (let attribute of element.attributes) {
    data[attribute.name] = attribute.value
  }
  return data
}

/**
 * Serialize a HTML element into JSON
 */
export default {
  type: 'HTMLElement',
  shouldTransform(type: any, obj: any) {
    return (
      obj &&
      obj.children &&
      typeof obj.innerHTML === 'string' &&
      typeof obj.tagName === 'string'
    )
  },
  toSerializable(element: HTMLElement) {
    return {
      tagName: element.tagName.toLowerCase(),
      attributes: objectifyAttributes(element),
      innerHTML: element.innerHTML,
    } as Storage
  },
  fromSerializable(data: Storage) {
    try {
      const element = getSandbox().createElement(data.tagName)
      element.innerHTML = data.innerHTML
      for (let attribute of Object.keys(data.attributes)) {
        try {
          element.setAttribute(attribute, data.attributes[attribute])
        } catch (e) {}
      }
      return element
    } catch (e) {
      return data
    }
  },
}
