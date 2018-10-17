var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { URI } from '../base/common/uri';
import { TPromise } from '../base/common/winjs.base';
import { IQuickInputService } from '../platform/quickinput/common/quickInput';
var CodeSandboxFileDialogService = /** @class */ (function () {
    function CodeSandboxFileDialogService(quickInput) {
        this.quickInput = quickInput;
    }
    CodeSandboxFileDialogService.prototype.defaultFilePath = function (schemeFilter) {
        throw new Error('Called defaultFilePath');
    };
    CodeSandboxFileDialogService.prototype.defaultFolderPath = function (schemeFilter) {
        throw new Error('Called defaultFolderPath');
    };
    CodeSandboxFileDialogService.prototype.defaultWorkspacePath = function (schemeFilter) {
        throw new Error('Called defaultWorkspacePath');
    };
    CodeSandboxFileDialogService.prototype.toNativeOpenDialogOptions = function (options) {
        throw new Error('Called toNativeOpenDialogOptions');
    };
    CodeSandboxFileDialogService.prototype.pickFileFolderAndOpen = function (options) {
        throw new Error('Called pickFileFolderAndOpen');
    };
    CodeSandboxFileDialogService.prototype.pickFileAndOpen = function (options) {
        throw new Error('called pickFileAndOpen');
    };
    CodeSandboxFileDialogService.prototype.pickFolderAndOpen = function (options) {
        throw new Error('called pickFolderAndOpen');
    };
    CodeSandboxFileDialogService.prototype.pickWorkspaceAndOpen = function (options) {
        throw new Error('called pickWorkspaceAndOpen');
    };
    CodeSandboxFileDialogService.prototype.toNativeSaveDialogOptions = function (options) {
        throw new Error('Called toNativeSaveDialogOptions');
    };
    CodeSandboxFileDialogService.prototype.showSaveDialog = function (options) {
        var _this = this;
        var pathParts = options.defaultUri.fsPath.split('/');
        var filename = pathParts.pop();
        // pop last opened file, for some reason vscode suggests this: "/sandbox/src/index.js/Untitled-1.css"
        pathParts.pop();
        var defaultPath = pathParts.join('/') + '/' + filename;
        return new TPromise(function (resolve, reject) {
            _this.quickInput
                .input({
                placeHolder: 'Where should we save the file?',
                value: defaultPath.replace(/^\/sandbox/, ''),
            })
                .then(function (val) {
                if (!val) {
                    return resolve(undefined);
                }
                resolve(URI.file('/sandbox' + val));
            });
        });
    };
    CodeSandboxFileDialogService.prototype.showOpenDialog = function (options) {
        throw new Error('Called showOpenDialog');
    };
    CodeSandboxFileDialogService = __decorate([
        __param(0, IQuickInputService)
    ], CodeSandboxFileDialogService);
    return CodeSandboxFileDialogService;
}());
export { CodeSandboxFileDialogService };
