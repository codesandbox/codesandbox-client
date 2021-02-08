/**
 * @author Yosuke Ota
 * See LICENSE file in root directory for full license.
 */
'use strict'
module.exports = {
  deprecated: '2.6.0',
  supported: '>=2.5.0 <3.0.0',
  /**
   * @param {RuleContext} context
   * @param {object} option
   * @param {boolean} [option.fixToUpgrade]
   * @returns {TemplateListener}
   */
  createTemplateBodyVisitor(context, { fixToUpgrade } = {}) {
    const sourceCode = context.getSourceCode()

    /**
     * Checks whether the given node can convert to the `v-slot`.
     * @param {VStartTag} startTag node of `<element v-slot ... >`
     * @returns {boolean} `true` if the given node can convert to the `v-slot`
     */
    function canConvertToVSlot(startTag) {
      if (startTag.parent.name !== 'template') {
        return false
      }

      const slotAttr = startTag.attributes.find(
        (attr) => attr.directive === false && attr.key.name === 'slot'
      )
      if (slotAttr) {
        // if the element have `slot` it can not be converted.
        // Conversion of `slot` is done with `vue/no-deprecated-slot-attribute`.
        return false
      }

      const vBindSlotAttr = startTag.attributes.find(
        (attr) =>
          attr.directive === true &&
          attr.key.name.name === 'bind' &&
          attr.key.argument &&
          attr.key.argument.type === 'VIdentifier' &&
          attr.key.argument.name === 'slot'
      )
      if (vBindSlotAttr) {
        // if the element have `v-bind:slot` it can not be converted.
        // Conversion of `v-bind:slot` is done with `vue/no-deprecated-slot-attribute`.
        return false
      }
      return true
    }

    /**
     * Convert to `v-slot`.
     * @param {RuleFixer} fixer fixer
     * @param {VDirective} scopeAttr node of `slot-scope`
     * @returns {Fix} fix data
     */
    function fixSlotScopeToVSlot(fixer, scopeAttr) {
      const scopeValue =
        scopeAttr && scopeAttr.value
          ? `=${sourceCode.getText(scopeAttr.value)}`
          : ''

      const replaceText = `v-slot${scopeValue}`
      return fixer.replaceText(scopeAttr, replaceText)
    }
    /**
     * Reports `slot-scope` node
     * @param {VDirective} scopeAttr node of `slot-scope`
     * @returns {void}
     */
    function reportSlotScope(scopeAttr) {
      context.report({
        node: scopeAttr.key,
        messageId: 'forbiddenSlotScopeAttribute',
        fix(fixer) {
          if (!fixToUpgrade) {
            return null
          }
          // fix to use `v-slot`
          const startTag = scopeAttr.parent
          if (!canConvertToVSlot(startTag)) {
            return null
          }
          return fixSlotScopeToVSlot(fixer, scopeAttr)
        }
      })
    }

    return {
      "VAttribute[directive=true][key.name.name='slot-scope']": reportSlotScope
    }
  }
}
