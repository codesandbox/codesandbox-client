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
import { EditorInput } from "../../../../workbench/common/editor.js";
import { ITextFileService } from "../../../../workbench/services/textfile/common/textfiles.js";
import { ITextModelService } from "../../../../editor/common/services/resolverService.js";
import { basename } from "../../../../base/common/resources.js";
import { TEXT_FILE_EDITOR_ID } from "../../../../workbench/parts/files/common/files.js";
var ReactEditorInput = /** @class */ (function (_super) {
    __extends(ReactEditorInput, _super);
    function ReactEditorInput(resource, _renderComponent, textFileService, textModelResolverService) {
        var _this = _super.call(this) || this;
        _this.resource = resource;
        _this._renderComponent = _renderComponent;
        _this.textFileService = textFileService;
        _this.textModelResolverService = textModelResolverService;
        _this.forceOpenText = false;
        return _this;
    }
    ReactEditorInput.prototype.renderComponent = function (container, openAsText) {
        var _this = this;
        if (this.disposeListener) {
            this.disposeListener();
            this.disposeListener = null;
        }
        this._renderComponent(container, {
            onChangeVSCode: function (val) { return _this.updateValue(val); },
            getCode: function () { return _this.getValue(); },
            onDidChangeDirty: function (cb) { return _this.onDidChangeDirty(cb); },
            onDispose: function (cb) {
                _this.disposeListener = cb;
                _this.onDispose(cb);
            },
            openText: function () {
                openAsText();
            }
        });
    };
    ReactEditorInput.prototype.forceOpenAsText = function () {
        this.forceOpenText = true;
    };
    ReactEditorInput.prototype.getValue = function () {
        var model = this.textFileService.models.get(this.resource);
        if (model) {
            return model.textEditorModel.getValue();
        }
        return '';
    };
    ReactEditorInput.prototype.updateValue = function (newValue) {
        var model = this.textFileService.models.get(this.resource);
        if (model) {
            model.textEditorModel.applyEdits([{
                    text: newValue,
                    range: model.textEditorModel.getFullModelRange()
                }]);
            this._onDidChangeDirty.fire();
        }
    };
    ReactEditorInput.prototype.getTypeId = function () {
        return ReactEditorInput.ID;
    };
    ReactEditorInput.prototype.getName = function () {
        return "Configuration (" + basename(this.resource) + ")";
    };
    ReactEditorInput.prototype.getResource = function () {
        return this.resource;
    };
    ReactEditorInput.prototype.isResolved = function () {
        return !!this.textFileService.models.get(this.resource);
    };
    ReactEditorInput.prototype.isDirty = function () {
        var model = this.textFileService.models.get(this.resource);
        return model ? model.isDirty() : false;
    };
    ReactEditorInput.prototype.confirmSave = function () {
        return Promise.resolve(0 /* SAVE */);
    };
    ReactEditorInput.prototype.save = function () {
        return Promise.resolve(true);
    };
    ReactEditorInput.prototype.getPreferredEditorId = function (candidates) {
        if (this.forceOpenText) {
            return TEXT_FILE_EDITOR_ID;
        }
        return candidates[0];
    };
    ReactEditorInput.prototype.matches = function (otherInput) {
        return otherInput.getResource && this.getResource().toString() === otherInput.getResource().toString();
    };
    ReactEditorInput.prototype.resolve = function () {
        var _this = this;
        // Resolve as text
        return this.textFileService.models.loadOrCreate(this.resource, {
            reload: { async: true },
            reason: 1 /* EDITOR */
        }).then(function (model) {
            _this._register(model.onDidStateChange(function () {
                _this._onDidChangeDirty.fire();
            }));
            // This is a bit ugly, because we first resolve the model and then resolve a model reference. the reason being that binary
            // or very large files do not resolve to a text file model but should be opened as binary files without text. First calling into
            // loadOrCreate ensures we are not creating model references for these kind of resources.
            // In addition we have a bit of payload to take into account (encoding, reload) that the text resolver does not handle yet.
            if (!_this.textModelReference) {
                _this.textModelReference = _this.textModelResolverService.createModelReference(_this.resource);
            }
            return _this.textModelReference.then(function (ref) { return ref.object; });
        }, function (error) {
            // Bubble any other error up
            return Promise.reject(error);
        });
    };
    ReactEditorInput.ID = 'workbench.input.react';
    ReactEditorInput = __decorate([
        __param(2, ITextFileService),
        __param(3, ITextModelService)
    ], ReactEditorInput);
    return ReactEditorInput;
}(EditorInput));
export { ReactEditorInput };
