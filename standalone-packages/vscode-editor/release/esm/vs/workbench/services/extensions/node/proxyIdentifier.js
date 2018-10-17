/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
var ProxyIdentifier = /** @class */ (function () {
    function ProxyIdentifier(isMain, sid) {
        this.isMain = isMain;
        this.sid = sid;
        this.nid = (++ProxyIdentifier.count);
    }
    ProxyIdentifier.count = 0;
    return ProxyIdentifier;
}());
export { ProxyIdentifier };
var identifiers = [];
export function createMainContextProxyIdentifier(identifier) {
    var result = new ProxyIdentifier(true, identifier);
    identifiers[result.nid] = result;
    return result;
}
export function createExtHostContextProxyIdentifier(identifier) {
    var result = new ProxyIdentifier(false, identifier);
    identifiers[result.nid] = result;
    return result;
}
export function getStringIdentifierForProxy(nid) {
    return identifiers[nid].sid;
}
