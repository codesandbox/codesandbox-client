"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.SelectTypeScriptVersionCommand = void 0;
class SelectTypeScriptVersionCommand {
    constructor(lazyClientHost) {
        this.lazyClientHost = lazyClientHost;
        this.id = SelectTypeScriptVersionCommand.id;
    }
    execute() {
        this.lazyClientHost.value.serviceClient.showVersionPicker();
    }
}
exports.SelectTypeScriptVersionCommand = SelectTypeScriptVersionCommand;
SelectTypeScriptVersionCommand.id = 'typescript.selectTypeScriptVersion';
//# sourceMappingURL=selectTypeScriptVersion.js.map