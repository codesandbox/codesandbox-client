import {
  ParseSourceSpan,
  splitNsName,
  Element,
  Comment,
  Text,
  Node,
  Doctype,
  Attribute
} from '@starptech/webparser'

const htmlSchema = require('property-information/html')
const svgSchema = require('property-information/svg')
const hastSvg = require('@starptech/prettyhtml-hastscript/svg')
const hast = require('@starptech/prettyhtml-hastscript')

const GAP_REGEX = /\n\s*?\n\s*?$/

function isFakeRoot(obj: Element): boolean {
  return obj.name === ':webparser:root'
}

type Options = {}

type TransformOptions = {
  schema?: { space: string }
}

type HastNode = {
  name?: string
  type: string
  tagName?: string
  properties?: Array<Object>
  position?: { start: any; end: any }
  children?: HastNode[]
  public?: string
  system?: string
  value?: string
  data?: { [name: string]: any }
}

/* Wrapper to normalise options. */
export = function from(rootNodes: Node[], options: Options = {}) {
  const sourceSpan = new ParseSourceSpan(null, null)
  const fakeRoot = new Element(':webparser:root', [], rootNodes, false, sourceSpan)
  const result = transform(fakeRoot, null, {
    schema: htmlSchema
  })

  return result
}

/* Transform a node. */
function transform(ast: Node, nextAst: Node | null, config: TransformOptions): HastNode {
  const schema = config.schema
  let node: HastNode

  if (ast instanceof Element) {
    let children: HastNode[]
    config.schema = getElementNameAndNS(ast.name).ns === 'svg' ? svgSchema : htmlSchema
    if (ast.children && ast.children.length) {
      children = nodes(ast.children, config)
    }

    if (isFakeRoot(ast)) {
      node = root(ast, children)
    } else {
      node = element(ast, children, config)
    }

    node.data = node.data || {}
    node.data.selfClosing =
      ast.startSourceSpan === ast.endSourceSpan && ast.startSourceSpan !== null && ast.endSourceSpan !== null
    if (isGap(nextAst)) node.data.gapAfter = true
  } else if (ast instanceof Text) {
    node = text(ast)
  } else if (ast instanceof Comment) {
    node = comment(ast)
    if (isGap(nextAst)) {
      node.data = node.data || {}
      node.data.gapAfter = true
    }
  } else if (ast instanceof Doctype) {
    node = {
      type: 'doctype',
      name: 'html',
      public: null,
      system: null
    }
  }

  if (ast instanceof Element) {
    if (ast.startSourceSpan && ast.endSourceSpan) {
      node.position = {
        start: {
          // webparser format counts lines beginning from zero
          line: ++ast.startSourceSpan.start.line,
          column: ast.startSourceSpan.start.col,
          offset: ast.startSourceSpan.start.offset
        },
        end: {
          line: ++ast.endSourceSpan.end.line,
          column: ast.endSourceSpan.end.col,
          offset: ast.endSourceSpan.end.offset
        }
      }
    }
  } else {
    node.position = {
      start: {
        line: ++ast.sourceSpan.start.line,
        column: ast.sourceSpan.start.col,
        offset: ast.sourceSpan.start.offset
      },
      end: {
        line: ++ast.sourceSpan.end.line,
        column: ast.sourceSpan.end.col,
        offset: ast.sourceSpan.end.offset
      }
    }
  }

  config.schema = schema

  return node
}

/* Transform children. */
function nodes(children: Node[], config: TransformOptions): HastNode[] {
  const length = children.length
  let index = -1
  const result: HastNode[] = []

  while (++index < length) {
    const nextChildren = index + 1 < length ? children[index + 1] : null
    result[index] = transform(children[index], nextChildren, config)
  }

  return result
}

function root(ast: Node, children: HastNode[]): HastNode {
  return { type: 'root', children, data: {} }
}

/* Transform a text. */
function text(ast: Text): HastNode {
  return { type: 'text', value: ast.value }
}

/* Transform a comment. */
function comment(ast: Comment): HastNode {
  return { type: 'comment', value: ast.value }
}

function getAttributeName(attribute: Attribute) {
  const colons = attribute.name.split(':')

  // attrName from webparser: ":xmlns:xlink"
  // remove first colon because it was added by webparser
  if (attribute.implicitNs === true && colons.length >= 3) {
    return colons.slice(1).join(':')
  }

  return attribute.name
}

function getElementNameAndNS(name: string, implicitNs = false) {
  const info = splitNsName(name)

  // when a ns was set but no implicit was propagated
  if (implicitNs == false && info[0]) {
    return { ns: info[0], name: info[0] + ':' + info[1] }
  }

  return { ns: info[0], name: info[1] }
}

function isGap(el: Node): boolean {
  return el instanceof Text && el.value && GAP_REGEX.test(el.value)
}

/* Transform an element. */
function element(ast: Element, children: HastNode[], config: TransformOptions): HastNode {
  const fn = config.schema.space === 'svg' ? hastSvg : hast
  const nameInfo = getElementNameAndNS(ast.name, ast.implicitNs)
  const props: any = {}
  let node

  for (const attr of ast.attrs) {
    props[getAttributeName(attr)] = attr.value
  }

  // hastscript interpret any object with a "value" attribute as
  // unist node. This is a workaround to explicity express it as property.
  if (props.value) {
    props[Symbol.for('hast.isProp')] = true
  }

  node = fn(nameInfo.name, props, children)

  return node
}
