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
import { BaseEditor } from "../../../../workbench/browser/parts/editor/baseEditor.js";
import { ITelemetryService } from "../../../../platform/telemetry/common/telemetry.js";
import { IThemeService } from "../../../../platform/theme/common/themeService.js";
import { ReactEditorInput } from "./ReactEditorInput.js";
import { IEditorService } from "../../../../workbench/services/editor/common/editorService.js";
var ReactEditor = /** @class */ (function (_super) {
    __extends(ReactEditor, _super);
    function ReactEditor(telemetryService, themeService, editorService) {
        var _this = _super.call(this, ReactEditor.ID, telemetryService, themeService) || this;
        _this.editorService = editorService;
        return _this;
    }
    ReactEditor.prototype.openAsText = function () {
        if (this.input instanceof ReactEditorInput) {
            this.input.forceOpenAsText();
            this.editorService.openEditor(this.input);
        }
    };
    ReactEditor.prototype.setInput = function (input, options, token) {
        var _this = this;
        return _super.prototype.setInput.call(this, input, options, token)
            .then(function () { return new Promise(process.nextTick); }) // Force setInput to be async
            .then(function () {
            _this.render();
        });
    };
    ReactEditor.prototype.createEditor = function (parent) {
        /* done in setInput */
    };
    ReactEditor.prototype.render = function () {
        var _this = this;
        this.input.resolve().then(function (x) {
            if (_this.input instanceof ReactEditorInput) {
                _this.input.renderComponent(_this.getContainer(), function () { return _this.openAsText(); });
            }
        });
    };
    ReactEditor.prototype.layout = function (dimension) {
        this.getContainer().style.width = dimension.width + 'px';
        this.getContainer().style.height = dimension.height + 'px';
    };
    ReactEditor.ID = 'workbench.editor.react';
    ReactEditor = __decorate([
        __param(0, ITelemetryService),
        __param(1, IThemeService),
        __param(2, IEditorService)
    ], ReactEditor);
    return ReactEditor;
}(BaseEditor));
export { ReactEditor };
