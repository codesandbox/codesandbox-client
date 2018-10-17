var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Action } from '../../../base/common/actions.js';
import { TPromise } from '../../../base/common/winjs.base.js';
import { IQuickInputService, } from '../../../platform/quickinput/common/quickInput.js';
import { ICodeSandboxService } from './common/codesandbox.js';
var CodeSandboxTogglePreviewAction = /** @class */ (function (_super) {
    __extends(CodeSandboxTogglePreviewAction, _super);
    function CodeSandboxTogglePreviewAction(id, label, codeSandboxService) {
        var _this = _super.call(this, id, label) || this;
        _this.codeSandboxService = codeSandboxService;
        return _this;
    }
    CodeSandboxTogglePreviewAction.prototype.run = function () {
        var _this = this;
        return new TPromise(function (r) {
            _this.codeSandboxService.runSignal('editor.togglePreviewContent', {});
            r(null);
        });
    };
    CodeSandboxTogglePreviewAction.ID = 'codesandbox.preview.toggle';
    CodeSandboxTogglePreviewAction.LABEL = 'Toggle Preview';
    CodeSandboxTogglePreviewAction = __decorate([
        __param(2, ICodeSandboxService)
    ], CodeSandboxTogglePreviewAction);
    return CodeSandboxTogglePreviewAction;
}(Action));
export { CodeSandboxTogglePreviewAction };
var CodeSandboxOpenPreviewExternalAction = /** @class */ (function (_super) {
    __extends(CodeSandboxOpenPreviewExternalAction, _super);
    function CodeSandboxOpenPreviewExternalAction(id, label, codeSandboxService) {
        var _this = _super.call(this, id, label) || this;
        _this.codeSandboxService = codeSandboxService;
        return _this;
    }
    CodeSandboxOpenPreviewExternalAction.prototype.run = function () {
        var _this = this;
        return new TPromise(function (r) {
            _this.codeSandboxService.openPreviewExternally();
            r(null);
        });
    };
    CodeSandboxOpenPreviewExternalAction.ID = 'codesandbox.preview.external';
    CodeSandboxOpenPreviewExternalAction.LABEL = 'Open Preview In New Window';
    CodeSandboxOpenPreviewExternalAction = __decorate([
        __param(2, ICodeSandboxService)
    ], CodeSandboxOpenPreviewExternalAction);
    return CodeSandboxOpenPreviewExternalAction;
}(Action));
export { CodeSandboxOpenPreviewExternalAction };
var CodeSandboxAddDependencyAction = /** @class */ (function (_super) {
    __extends(CodeSandboxAddDependencyAction, _super);
    function CodeSandboxAddDependencyAction(id, label, codeSandboxService) {
        var _this = _super.call(this, id, label) || this;
        _this.codeSandboxService = codeSandboxService;
        return _this;
    }
    CodeSandboxAddDependencyAction.prototype.run = function () {
        var _this = this;
        return new TPromise(function (r) {
            _this.codeSandboxService.runSignal('modalOpened', {
                modal: 'searchDependencies',
            });
            r(null);
        });
    };
    CodeSandboxAddDependencyAction.ID = 'codesandbox.dependencies.add';
    CodeSandboxAddDependencyAction.LABEL = 'Add NPM Dependency';
    CodeSandboxAddDependencyAction = __decorate([
        __param(2, ICodeSandboxService)
    ], CodeSandboxAddDependencyAction);
    return CodeSandboxAddDependencyAction;
}(Action));
export { CodeSandboxAddDependencyAction };
var CodeSandboxSetThemeAction = /** @class */ (function (_super) {
    __extends(CodeSandboxSetThemeAction, _super);
    function CodeSandboxSetThemeAction(id, label, codeSandboxService, quickInputService) {
        var _this = _super.call(this, id, label) || this;
        _this.codeSandboxService = codeSandboxService;
        _this.quickInputService = quickInputService;
        return _this;
    }
    CodeSandboxSetThemeAction.prototype.run = function () {
        var _this = this;
        var picks = this.codeSandboxService
            .getThemes()
            .map(function (theme) { return ({
            id: theme.id,
            label: theme.name,
        }); });
        var currentTheme = this.codeSandboxService.getCurrentTheme();
        var currentPick = picks.filter(function (p) { return p.label === currentTheme; })[0];
        var pickTheme = function (label) {
            _this.codeSandboxService.runSignal('preferences.settingChanged', {
                name: 'editorTheme',
                value: label,
            });
        };
        var pickOptions = {
            activeItem: currentPick,
            onDidFocus: function (theme) {
                requestAnimationFrame(function () {
                    pickTheme(theme.label);
                });
            },
        };
        return this.quickInputService
            .pick(TPromise.as(picks), pickOptions)
            .then(function (pick) {
            if (!pick) {
                pickTheme(currentTheme);
            }
            else {
                pickTheme(pick.label);
            }
        });
    };
    CodeSandboxSetThemeAction.ID = 'codesandbox.theme.set';
    CodeSandboxSetThemeAction.LABEL = 'Color Theme';
    CodeSandboxSetThemeAction = __decorate([
        __param(2, ICodeSandboxService),
        __param(3, IQuickInputService)
    ], CodeSandboxSetThemeAction);
    return CodeSandboxSetThemeAction;
}(Action));
export { CodeSandboxSetThemeAction };
