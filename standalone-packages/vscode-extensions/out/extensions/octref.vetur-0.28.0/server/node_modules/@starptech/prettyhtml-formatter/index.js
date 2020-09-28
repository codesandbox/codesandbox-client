/* eslint no-param-reassign: ["error", { "props": true, "ignorePropertyModificationsFor": ["node"] }] */

'use strict'

const minify = require('@starptech/rehype-minify-whitespace')({
  newlines: true
})
const sensitive = require('html-whitespace-sensitive-tag-names')
const is = require('unist-util-is')
const isElement = require('hast-util-is-element')
const repeat = require('repeat-string')
const visit = require('unist-util-visit-parents')
const voids = require('html-void-elements')
const find = require('unist-util-find')
const toString = require('hast-util-to-string')
const prettier = require('prettier')
const expressionParser = require('@starptech/expression-parser')

module.exports = format

/* Constants. */
const single = '\n'
const tab = '\t'
const double = '\n\n'
const space = ' '
const re = /\n/g

const CONDITIONAL_COMMENT_REGEXP = /^\s*\[if .*/

/* Format white-space. */
function format(options) {
  const settings = options || {}
  const tabWidth = settings.tabWidth || 2
  const { useTabs } = settings
  let { indentInitial } = settings
  const usePrettier = settings.usePrettier !== false
  const prettierOpts = settings.prettier
  let indent

  if (useTabs) {
    indent = tab
  } else {
    indent = repeat(space, tabWidth)
  }

  return transform

  function markIgnoreVisitor(node, parents) {
    /**
     * Handle special prettyhtml flags to ignore attribute wrapping and/or whitespace handling
     */
    if (is('comment', node)) {
      if (node.value.indexOf('prettyhtml-ignore') !== -1) {
        return setAttributeOnChildren(node, parents, 'ignore', true)
      }
      if (node.value.indexOf('prettyhtml-preserve-whitespace') !== -1) {
        return setAttributeOnChildren(node, parents, 'preserveWhitespace', true)
      }
      if (node.value.indexOf('prettyhtml-preserve-attribute-wrapping') !== -1) {
        return setAttributeOnChildren(node, parents, 'preserveAttrWrapping', true)
      }
    }
  }

  function setAttributeOnChildren(node, parents, attributeName, attributeValue) {
    const parent = parents[parents.length - 1]
    const nodeIndex = parent ? parent.children.indexOf(node) : null
    if (nodeIndex !== null) {
      for (let i = nodeIndex; i < parent.children.length; i++) {
        const child = parent.children[i]
        if (isElement(child)) {
          setNodeData(child, attributeName, attributeValue)
          return visit.SKIP
        }
      }
    }
  }

  function transform(tree) {
    // check if we are in page mode to indent the first level
    indentInitial = isPageMode(tree)

    visit(tree, markIgnoreVisitor)

    const root = minify(tree)

    visit(root, visitor)

    return root

    function visitor(node, parents) {
      // holds a copy of the children
      const children = node.children || []
      const { length } = children
      let index = -1
      let child
      let level = parents.length

      if (indentInitial === false) {
        level--
      }

      if (node.data && (node.data.ignore || node.data.preserveWhitespace)) {
        return visit.SKIP
      }

      if (is('comment', node)) {
        indentComment(node, indent, level)
      }

      /**
       * If we find whitespace-sensitive nodes / inlines we skip it
       * e.g pre, textarea
       */
      if (ignore(parents.concat(node))) {
        setNodeData(node, 'indentLevel', level - 1)

        // clear empty script, textarea, pre, style tags
        if (length) {
          const empty = hasOnlyEmptyTextChildren(node)
          const isEmbeddedContent = isElement(node, 'style') || isElement(node, 'script')
          if (empty) {
            // eslint-disable-next-line no-param-reassign
            node.children = []
          }
          if (usePrettier && !empty && isEmbeddedContent) {
            prettierEmbeddedContent(node, level, indent, prettierOpts)
          }
        }

        return visit.SKIP
      }

      let newline = false
      // we have to look in the future because we indent leading text
      // on a newline when a child text node contains a newline. If we wouldn't do this
      // the formatter could produce an unstable result because in the next step we could produce newlines.
      const collpased = peekCollpase(node, children)

      /**
       * Indent children
       */
      index = -1
      while (++index < length) {
        // eslint-disable-next-line no-shadow
        const child = children[index]

        // only indent text in nodes
        // root text nodes should't influence other root nodes^^
        if (node.type === 'root') {
          break
        }

        if (is('text', child)) {
          if (containsNewline(child) || collpased) {
            newline = true
          }

          child.value = child.value
            // reduce newlines to one newline
            // $& contains the lastMatch
            .replace(re, `$&${repeat(indent, level)}`)
        }
      }

      // reset
      const result = []
      index = -1
      node.children = result

      let prevChild = null
      if (length) {
        // walk through children
        // hint: a child has no children informations we already walking through
        // the tree
        while (++index < length) {
          child = children[index]

          const indentLevel = level

          setNodeData(child, 'indentLevel', indentLevel)

          if (elementHasGap(prevChild)) {
            result.push({
              type: 'text',
              value: single
            })
          }

          if (
            isElementAfterConditionalComment(node, child, index, prevChild) ||
            isConCommentFollowedByComment(node, child, index, prevChild)
          ) {
            result.push({
              type: 'text',
              value: double + repeat(indent, indentLevel)
            })
          } else if (
            insertNewlineBeforeNode(node, children, child, index, prevChild) ||
            (newline && index === 0)
          ) {
            // only necessary because we are trying to indent tags on newlines
            // even when in inline context when possible
            if (is('text', prevChild)) {
              // remove trailing whitespaces and tabs because a newline is inserted before
              prevChild.value = prevChild.value.replace(/[ \t]+$/, '')
            }
            // remove leading whitespaces and tabs because a newline is inserted before
            if (is('text', child)) {
              child.value = child.value.replace(/^[ \t]+/, '')
            }

            result.push({
              type: 'text',
              value: single + repeat(indent, indentLevel)
            })
          }

          prevChild = child

          result.push(child)
        }
      }

      if (insertNewlineAfterNode(node, prevChild) || newline) {
        result.push({
          type: 'text',
          value: single + repeat(indent, level - 1)
        })
      }
    }
  }
}

function endsWithNewline(node) {
  return is('text', node) && node.value && /\s*\n\s*$/.test(node.value)
}

function startsWithNewline(node) {
  return is('text', node) && node.value && /^\s*\n/.test(node.value)
}

function containsNewline(node) {
  return node.value.indexOf(single) !== -1
}

/**
 * indent last line of comment
 * e.g
 * <!--
 *   foo
 *    -->
 * to
 * <!--
 *   foo
 * -->
 */
function indentComment(node, indent, level) {
  const commentLines = node.value.split(single)
  if (commentLines.length > 1) {
    commentLines[commentLines.length - 1] =
      repeat(indent, level - 1) + commentLines[commentLines.length - 1].trim()
    node.value = commentLines.join(single)
  }
}

function handleTemplateExpression(child, children) {
  const brackets = checkForTemplateExpression(child.value)
  if (brackets) {
    // dont touch nodes with single text element
    if (
      hasOnlyTextChildren({
        children
      })
    ) {
      return false
    }

    // dont add newline when newline is already in text
    if (startsWithNewline(child)) {
      return false
    }

    return true
  }
}

/**
 * Check if any children will be wrapped on a newline
 * @param {*} node
 * @param {*} children
 */
function peekCollpase(node, children) {
  let index = -1
  let prevChild = false
  while (++index < children.length) {
    const child = children[index]
    if (insertNewlineBeforeNode(node, children, child, index, prevChild)) {
      return true
    }
    prevChild = child
  }
}

function insertNewlineBeforeNode(node, children, child, index, prev) {
  // don't add newline when prev child already has one
  if (endsWithNewline(prev)) {
    return false
  }

  // every template expression is indented on a newline
  if (is('text', child) && handleTemplateExpression(child, children)) {
    return true
  }

  // insert newline when tag is on the same line as the comment
  if (is('comment', prev)) {
    return true
  }

  // embedded content is indented on newlines
  if (isElement(child, ['script', 'style']) && index !== 0) {
    return true
  }

  // don't add newline on the first element of the page
  const isRootElement = node.type === 'root' && index === 0
  if (isRootElement) {
    return false
  }
  const isChildTextElement = is('text', child)

  return !isChildTextElement
}

function insertNewlineAfterNode(node, prev) {
  // Add newline on the close tag after root element
  const isRootElement = node.type === 'root'
  if (isRootElement) {
    return true
  }

  const hasChilds = node.children.length > 0

  /**
   * e.g <label><input/>foo</label>
   */
  if (hasChilds && !hasOnlyTextChildren(node) && !isVoid(node)) {
    return true
  }

  /**
   * e.g <label>foo</label>
   */
  const isPrevTextNode = is('text', prev)
  return hasChilds && !isVoid(node) && !isPrevTextNode
}

function checkForTemplateExpression(value) {
  let result = expressionParser(value, { brackets: ['{{', '}}'] })
  // e.g angular, vue
  if (result.expressions && result.expressions.length) {
    return ['{{', '}}']
  }

  result = expressionParser(value, { brackets: ['{', '}'] })
  // e.g svelte, riotjs
  if (result.expressions && result.expressions.length) {
    return ['{', '}']
  }

  return null
}

function hasOnlyTextChildren(node) {
  const children = node.children || []

  if (children.length === 0) {
    return false
  }

  return children.every(n => is('text', n))
}

function hasOnlyEmptyTextChildren(node) {
  const children = node.children || []

  if (children.length === 0) {
    return false
  }

  return children.every(n => is('text', n) && /^\s+$/.test(n.value))
}

function isElementAfterConditionalComment(node, child, index, prev) {
  // insert double newline when conditional comment is before element
  if (is('comment', prev) && CONDITIONAL_COMMENT_REGEXP.test(prev.value) && isElement(child)) {
    return true
  }
  return false
}

function isConCommentFollowedByComment(node, child, index, prev) {
  // insert double newline when conditional comment is before a non conditional comment
  if (
    is('comment', prev) &&
    CONDITIONAL_COMMENT_REGEXP.test(prev.value) &&
    is('comment', child) &&
    !CONDITIONAL_COMMENT_REGEXP.test(child.value)
  ) {
    return true
  }
  return false
}

function elementHasGap(prev) {
  // insert double newline when there was an intended gap before the element in original document
  return prev && prev.data.gapAfter
}

function isVoid(node) {
  return voids.indexOf(node.tagName) !== -1
}

function ignore(nodes) {
  let index = nodes.length

  while (index--) {
    if (sensitive.indexOf(nodes[index].tagName) !== -1) {
      return true
    }
  }

  return false
}

function prettierEmbeddedContent(node, level, indent, prettierOpts) {
  const isStyleTag = isElement(node, 'style')
  const isScriptTag = isElement(node, 'script')
  let content = toString(node)
  const type = node.properties.type ? `type="${node.properties.type}"` : ''

  if (isScriptTag) {
    content = `<script ${type}>${content}</script>`
  } else if (isStyleTag) {
    content = `<style ${type}>${content}</style>`
  }

  let formattedText = prettier.format(
    content,
    Object.assign({}, prettierOpts, {
      parser: 'html'
    })
  )

  if (isScriptTag) {
    formattedText = formattedText.replace(/^<script.*>\n*/, '').replace(/<\/script\s*>\s*$/, '')
  } else if (isStyleTag) {
    formattedText = formattedText.replace(/^<style.*>\n*/, '').replace(/<\/style\s*>\s*$/, '')
  }

  node.children = [
    {
      type: 'text',
      value: single
    },
    {
      type: 'text',
      value: formattedText
    },
    {
      type: 'text',
      value: repeat(indent, level - 1)
    }
  ]
  return formattedText
}

function setNodeData(node, key, value) {
  const data = node.data || {}
  node.data = data
  node.data[key] = value
}

function isPageMode(ast) {
  return !find(ast, function findCondition(node) {
    return isElement(node, ['html', 'body', 'head'])
  })
}
