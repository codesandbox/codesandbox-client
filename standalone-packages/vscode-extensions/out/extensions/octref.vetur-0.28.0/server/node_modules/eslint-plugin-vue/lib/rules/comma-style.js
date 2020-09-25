/**
 * @author Yosuke Ota
 */
'use strict'

const { wrapCoreRule } = require('../utils')

// eslint-disable-next-line no-invalid-meta, no-invalid-meta-docs-categories
module.exports = wrapCoreRule(require('eslint/lib/rules/comma-style'), {
  create(_context, { coreHandlers }) {
    return {
      VSlotScopeExpression(node) {
        if (coreHandlers.FunctionExpression) {
          // @ts-expect-error -- Process params of VSlotScopeExpression as FunctionExpression.
          coreHandlers.FunctionExpression(node)
        }
      }
    }
  }
})
