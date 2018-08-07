/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
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
import { ICodeEditorService } from '../../../browser/services/codeEditorService';
import { IInstantiationService, optional } from '../../../../platform/instantiation/common/instantiation';
import { IContextKeyService } from '../../../../platform/contextkey/common/contextkey';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration';
import { IWorkspaceContextService } from '../../../../platform/workspace/common/workspace';
import { IStorageService } from '../../../../platform/storage/common/storage';
import { registerEditorContribution } from '../../../browser/editorExtensions';
import { ITextModelService } from '../../../common/services/resolverService';
import { IThemeService } from '../../../../platform/theme/common/themeService';
import { IEnvironmentService } from '../../../../platform/environment/common/environment';
import { INotificationService } from '../../../../platform/notification/common/notification';
import { ReferencesController } from '../../../contrib/referenceSearch/referencesController';
var StandaloneReferencesController = /** @class */ (function (_super) {
    __extends(StandaloneReferencesController, _super);
    function StandaloneReferencesController(editor, contextKeyService, editorService, textModelResolverService, notificationService, instantiationService, contextService, storageService, themeService, configurationService, environmentService) {
        return _super.call(this, true, editor, contextKeyService, editorService, textModelResolverService, notificationService, instantiationService, contextService, storageService, themeService, configurationService, environmentService) || this;
    }
    StandaloneReferencesController = __decorate([
        __param(1, IContextKeyService),
        __param(2, ICodeEditorService),
        __param(3, ITextModelService),
        __param(4, INotificationService),
        __param(5, IInstantiationService),
        __param(6, IWorkspaceContextService),
        __param(7, IStorageService),
        __param(8, IThemeService),
        __param(9, IConfigurationService),
        __param(10, optional(IEnvironmentService))
    ], StandaloneReferencesController);
    return StandaloneReferencesController;
}(ReferencesController));
export { StandaloneReferencesController };
registerEditorContribution(StandaloneReferencesController);
