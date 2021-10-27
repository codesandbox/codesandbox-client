"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
class RestartTsServerCommand {
    constructor(lazyClientHost) {
        this.lazyClientHost = lazyClientHost;
        this.id = 'typescript.restartTsServer';
    }
    execute() {
        this.lazyClientHost.value.serviceClient.restartTsServer();
    }
}
exports.RestartTsServerCommand = RestartTsServerCommand;
//# sourceMappingURL=restartTsServer.js.map