/**
 * @author Yosuke Ota
 * See LICENSE file in root directory for full license.
 */
'use strict'
module.exports = {
  supported: '>=3.0.0',
  /** @param {RuleContext} context @returns {TemplateListener} */
  createTemplateBodyVisitor(context) {
    /**
     * Reports `v-is` node
     * @param {VDirective} vSlotAttr node of `v-is`
     * @returns {void}
     */
    function reportVSlot(vSlotAttr) {
      context.report({
        node: vSlotAttr.key,
        messageId: 'forbiddenVIs'
      })
    }

    return {
      "VAttribute[directive=true][key.name.name='is']": reportVSlot
    }
  }
}
