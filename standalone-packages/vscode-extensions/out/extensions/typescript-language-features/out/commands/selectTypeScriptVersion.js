"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
class SelectTypeScriptVersionCommand {
    constructor(lazyClientHost) {
        this.lazyClientHost = lazyClientHost;
        this.id = 'typescript.selectTypeScriptVersion';
    }
    execute() {
        this.lazyClientHost.value.serviceClient.onVersionStatusClicked();
    }
}
exports.SelectTypeScriptVersionCommand = SelectTypeScriptVersionCommand;
//# sourceMappingURL=selectTypeScriptVersion.js.map