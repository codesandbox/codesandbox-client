/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
import { URI } from '../../../base/common/uri.js';
import { createExtHostContextProxyIdentifier as createExtId, createMainContextProxyIdentifier as createMainId } from '../../services/extensions/node/proxyIdentifier.js';
export var TextEditorRevealType;
(function (TextEditorRevealType) {
    TextEditorRevealType[TextEditorRevealType["Default"] = 0] = "Default";
    TextEditorRevealType[TextEditorRevealType["InCenter"] = 1] = "InCenter";
    TextEditorRevealType[TextEditorRevealType["InCenterIfOutsideViewport"] = 2] = "InCenterIfOutsideViewport";
    TextEditorRevealType[TextEditorRevealType["AtTop"] = 3] = "AtTop";
})(TextEditorRevealType || (TextEditorRevealType = {}));
export var ObjectIdentifier;
(function (ObjectIdentifier) {
    ObjectIdentifier.name = '$ident';
    function mixin(obj, id) {
        Object.defineProperty(obj, ObjectIdentifier.name, { value: id, enumerable: true });
        return obj;
    }
    ObjectIdentifier.mixin = mixin;
    function of(obj) {
        return obj[ObjectIdentifier.name];
    }
    ObjectIdentifier.of = of;
})(ObjectIdentifier || (ObjectIdentifier = {}));
var IdObject = /** @class */ (function () {
    function IdObject() {
    }
    IdObject.mixin = function (object) {
        object._id = IdObject._n++;
        return object;
    };
    IdObject._n = 0;
    return IdObject;
}());
export { IdObject };
export function reviveWorkspaceEditDto(data) {
    if (data && data.edits) {
        for (var _i = 0, _a = data.edits; _i < _a.length; _i++) {
            var edit = _a[_i];
            if (typeof edit.resource === 'object') {
                edit.resource = URI.revive(edit.resource);
            }
            else {
                edit.newUri = URI.revive(edit.newUri);
                edit.oldUri = URI.revive(edit.oldUri);
            }
        }
    }
    return data;
}
// --- proxy identifiers
export var MainContext = {
    MainThreadCommands: createMainId('MainThreadCommands'),
    MainThreadComments: createMainId('MainThreadComments'),
    MainThreadConfiguration: createMainId('MainThreadConfiguration'),
    // MainThreadDebugService: createMainId<MainThreadDebugServiceShape>('MainThreadDebugService'),
    MainThreadDecorations: createMainId('MainThreadDecorations'),
    MainThreadDiagnostics: createMainId('MainThreadDiagnostics'),
    MainThreadDialogs: createMainId('MainThreadDiaglogs'),
    MainThreadDocuments: createMainId('MainThreadDocuments'),
    MainThreadDocumentContentProviders: createMainId('MainThreadDocumentContentProviders'),
    MainThreadTextEditors: createMainId('MainThreadTextEditors'),
    MainThreadErrors: createMainId('MainThreadErrors'),
    MainThreadTreeViews: createMainId('MainThreadTreeViews'),
    MainThreadLanguageFeatures: createMainId('MainThreadLanguageFeatures'),
    MainThreadLanguages: createMainId('MainThreadLanguages'),
    MainThreadMessageService: createMainId('MainThreadMessageService'),
    MainThreadOutputService: createMainId('MainThreadOutputService'),
    MainThreadProgress: createMainId('MainThreadProgress'),
    MainThreadQuickOpen: createMainId('MainThreadQuickOpen'),
    // MainThreadStatusBar: createMainId<MainThreadStatusBarShape>('MainThreadStatusBar'),
    MainThreadStorage: createMainId('MainThreadStorage'),
    MainThreadTelemetry: createMainId('MainThreadTelemetry'),
    // MainThreadTerminalService: createMainId<MainThreadTerminalServiceShape>('MainThreadTerminalService'),
    // MainThreadWebviews: createMainId<MainThreadWebviewsShape>('MainThreadWebviews'),
    // MainThreadUrls: createMainId<MainThreadUrlsShape>('MainThreadUrls'),
    // MainThreadWorkspace: createMainId<MainThreadWorkspaceShape>('MainThreadWorkspace'),
    MainThreadFileSystem: createMainId('MainThreadFileSystem'),
    MainThreadExtensionService: createMainId('MainThreadExtensionService'),
    // MainThreadSCM: createMainId<MainThreadSCMShape>('MainThreadSCM'),
    // MainThreadSearch: createMainId<MainThreadSearchShape>('MainThreadSearch'),
    // MainThreadTask: createMainId<MainThreadTaskShape>('MainThreadTask'),
    MainThreadWindow: createMainId('MainThreadWindow'),
};
export var ExtHostContext = {
    ExtHostCommands: createExtId('ExtHostCommands'),
    ExtHostConfiguration: createExtId('ExtHostConfiguration'),
    ExtHostDiagnostics: createExtId('ExtHostDiagnostics'),
    // ExtHostDebugService: createExtId<ExtHostDebugServiceShape>('ExtHostDebugService'),
    ExtHostDecorations: createExtId('ExtHostDecorations'),
    ExtHostDocumentsAndEditors: createExtId('ExtHostDocumentsAndEditors'),
    ExtHostDocuments: createExtId('ExtHostDocuments'),
    ExtHostDocumentContentProviders: createExtId('ExtHostDocumentContentProviders'),
    ExtHostDocumentSaveParticipant: createExtId('ExtHostDocumentSaveParticipant'),
    ExtHostEditors: createExtId('ExtHostEditors'),
    ExtHostTreeViews: createExtId('ExtHostTreeViews'),
    ExtHostFileSystem: createExtId('ExtHostFileSystem'),
    ExtHostFileSystemEventService: createExtId('ExtHostFileSystemEventService'),
    ExtHostHeapService: createExtId('ExtHostHeapMonitor'),
    ExtHostLanguageFeatures: createExtId('ExtHostLanguageFeatures'),
    ExtHostQuickOpen: createExtId('ExtHostQuickOpen'),
    ExtHostExtensionService: createExtId('ExtHostExtensionService'),
    ExtHostLogService: createExtId('ExtHostLogService'),
    // ExtHostTerminalService: createExtId<ExtHostTerminalServiceShape>('ExtHostTerminalService'),
    // ExtHostSCM: createExtId<ExtHostSCMShape>('ExtHostSCM'),
    // ExtHostSearch: createExtId<ExtHostSearchShape>('ExtHostSearch'),
    // ExtHostTask: createExtId<ExtHostTaskShape>('ExtHostTask'),
    // ExtHostWorkspace: createExtId<ExtHostWorkspaceShape>('ExtHostWorkspace'),
    ExtHostWindow: createExtId('ExtHostWindow'),
    // ExtHostWebviews: createExtId<ExtHostWebviewsShape>('ExtHostWebviews'),
    ExtHostProgress: createMainId('ExtHostProgress'),
    ExtHostComments: createMainId('ExtHostComments'),
    ExtHostUrls: createExtId('ExtHostUrls'),
    ExtHostOutputService: createMainId('ExtHostOutputService'),
};
