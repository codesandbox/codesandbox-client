/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
import { TPromise } from '../../../../base/common/winjs.base';
import { onUnexpectedError } from '../../../../base/common/errors';
import { toResource } from '../../../common/editor';
import { CancellationToken } from '../../../../base/common/cancellation';
export var WorkspaceSymbolProviderRegistry;
(function (WorkspaceSymbolProviderRegistry) {
    var _supports = [];
    function register(support) {
        if (support) {
            _supports.push(support);
        }
        return {
            dispose: function () {
                if (support) {
                    var idx = _supports.indexOf(support);
                    if (idx >= 0) {
                        _supports.splice(idx, 1);
                        support = undefined;
                    }
                }
            }
        };
    }
    WorkspaceSymbolProviderRegistry.register = register;
    function all() {
        return _supports.slice(0);
    }
    WorkspaceSymbolProviderRegistry.all = all;
})(WorkspaceSymbolProviderRegistry || (WorkspaceSymbolProviderRegistry = {}));
export function getWorkspaceSymbols(query, token) {
    if (token === void 0) { token = CancellationToken.None; }
    var result = [];
    var promises = WorkspaceSymbolProviderRegistry.all().map(function (support) {
        return Promise.resolve(support.provideWorkspaceSymbols(query, token)).then(function (value) {
            if (Array.isArray(value)) {
                result.push([support, value]);
            }
        }, onUnexpectedError);
    });
    return TPromise.join(promises).then(function (_) { return result; });
}
/**
 * Helper to return all opened editors with resources not belonging to the currently opened workspace.
 */
export function getOutOfWorkspaceEditorResources(editorService, contextService) {
    var resources = [];
    editorService.editors.forEach(function (editor) {
        var resource = toResource(editor, { supportSideBySide: true });
        if (resource && !contextService.isInsideWorkspace(resource)) {
            resources.push(resource);
        }
    });
    return resources;
}
