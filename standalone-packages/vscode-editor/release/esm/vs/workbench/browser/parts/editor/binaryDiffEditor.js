/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
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
import * as nls from '../../../../nls.js';
import { BINARY_DIFF_EDITOR_ID } from '../../../common/editor.js';
import { ITelemetryService } from '../../../../platform/telemetry/common/telemetry.js';
import { IThemeService } from '../../../../platform/theme/common/themeService.js';
import { SideBySideEditor } from './sideBySideEditor.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { BaseBinaryResourceEditor } from './binaryEditor.js';
/**
 * An implementation of editor for diffing binary files like images or videos.
 */
var BinaryResourceDiffEditor = /** @class */ (function (_super) {
    __extends(BinaryResourceDiffEditor, _super);
    function BinaryResourceDiffEditor(telemetryService, instantiationService, themeService) {
        return _super.call(this, telemetryService, instantiationService, themeService) || this;
    }
    BinaryResourceDiffEditor.prototype.getMetadata = function () {
        var master = this.masterEditor;
        var details = this.detailsEditor;
        if (master instanceof BaseBinaryResourceEditor && details instanceof BaseBinaryResourceEditor) {
            return nls.localize('metadataDiff', "{0} ↔ {1}", details.getMetadata(), master.getMetadata());
        }
        return null;
    };
    BinaryResourceDiffEditor.ID = BINARY_DIFF_EDITOR_ID;
    BinaryResourceDiffEditor = __decorate([
        __param(0, ITelemetryService),
        __param(1, IInstantiationService),
        __param(2, IThemeService)
    ], BinaryResourceDiffEditor);
    return BinaryResourceDiffEditor;
}(SideBySideEditor));
export { BinaryResourceDiffEditor };
