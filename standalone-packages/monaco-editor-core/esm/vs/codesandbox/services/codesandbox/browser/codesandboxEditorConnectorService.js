var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { ICodeSandboxService } from '../common/codesandbox';
import { IEditorService } from '../../../../workbench/services/editor/common/editorService';
import { dispose } from '../../../../base/common/lifecycle';
import { toResource } from '../../../../workbench/common/editor';
/**
 * A service that enables to search for files or with in files.
 */
var CodeSandboxEditorConnectorService = /** @class */ (function () {
    function CodeSandboxEditorConnectorService(_codesandboxService, _editorService) {
        this._codesandboxService = _codesandboxService;
        this._editorService = _editorService;
        this._toDispose = [];
        _editorService.onDidActiveEditorChange(this.updateCurrentFileOpen, this, this._toDispose);
    }
    CodeSandboxEditorConnectorService.prototype.updateCurrentFileOpen = function () {
        var file = toResource(this._editorService.activeEditor, {
            supportSideBySide: true,
            filter: 'file',
        });
        var path = (file ? file.fsPath : '').replace(/^\/sandbox/, '');
        if (path) {
            this._codesandboxService.runSignal('editor.moduleSelected', { path: path });
        }
        else {
            this._codesandboxService.runSignal('editor.clearModuleSelected', {});
        }
    };
    CodeSandboxEditorConnectorService.prototype.dispose = function () {
        this._toDispose = dispose(this._toDispose);
    };
    CodeSandboxEditorConnectorService = __decorate([
        __param(0, ICodeSandboxService),
        __param(1, IEditorService)
    ], CodeSandboxEditorConnectorService);
    return CodeSandboxEditorConnectorService;
}());
export { CodeSandboxEditorConnectorService };
