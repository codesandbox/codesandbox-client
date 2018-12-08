/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var InternalEditorAction = /** @class */ (function () {
    function InternalEditorAction(id, label, alias, precondition, run, contextKeyService) {
        this.id = id;
        this.label = label;
        this.alias = alias;
        this._precondition = precondition;
        this._run = run;
        this._contextKeyService = contextKeyService;
    }
    InternalEditorAction.prototype.isSupported = function () {
        return this._contextKeyService.contextMatchesRules(this._precondition);
    };
    InternalEditorAction.prototype.run = function () {
        if (!this.isSupported()) {
            return Promise.resolve(void 0);
        }
        var r = this._run();
        return r ? r : Promise.resolve(void 0);
    };
    return InternalEditorAction;
}());
export { InternalEditorAction };
