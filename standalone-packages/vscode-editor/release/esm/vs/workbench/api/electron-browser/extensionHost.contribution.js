/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Extensions as WorkbenchExtensions } from '../../common/contributions.js';
import { Registry } from '../../../platform/registry/common/platform.js';
import { IInstantiationService } from '../../../platform/instantiation/common/instantiation.js';
// --- other interested parties
import { JSONValidationExtensionPoint } from '../../services/jsonschemas/common/jsonValidationExtensionPoint.js';
import { ColorExtensionPoint } from '../../services/themes/common/colorExtensionPoint.js';
import { LanguageConfigurationFileHandler } from '../../parts/codeEditor/electron-browser/languageConfiguration/languageConfigurationExtensionPoint.js';
// --- mainThread participants
import '../node/apiCommands.js';
import './mainThreadClipboard.js';
import './mainThreadCommands.js';
import './mainThreadConfiguration.js';
// import './mainThreadDebugService';
import './mainThreadDecorations.js';
import './mainThreadDiagnostics.js';
import './mainThreadDialogs.js';
import './mainThreadDocumentContentProviders.js';
import './mainThreadDocuments.js';
import './mainThreadDocumentsAndEditors.js';
import './mainThreadEditor.js';
import './mainThreadEditors.js';
import './mainThreadErrors.js';
import './mainThreadExtensionService.js';
import './mainThreadFileSystem.js';
import './mainThreadFileSystemEventService.js';
import './mainThreadHeapService.js';
import './mainThreadLanguageFeatures.js';
import './mainThreadLanguages.js';
import './mainThreadMessageService.js';
// import './mainThreadOutputService';
import './mainThreadProgress.js';
import './mainThreadQuickOpen.js';
// import './mainThreadSCM';
// import './mainThreadSearch';
import './mainThreadSaveParticipant.js';
import './mainThreadStatusBar.js';
import './mainThreadStorage.js';
// import './mainThreadTask';
import './mainThreadTelemetry.js';
// import './mainThreadTerminalService';
// import './mainThreadTreeViews';
import './mainThreadLogService.js';
// import './mainThreadWebview';
// import './mainThreadComments';
import './mainThreadUrls.js';
import './mainThreadWindow.js';
import './mainThreadWorkspace.js';
var ExtensionPoints = /** @class */ (function () {
    function ExtensionPoints(instantiationService) {
        this.instantiationService = instantiationService;
        // Classes that handle extension points...
        this.instantiationService.createInstance(JSONValidationExtensionPoint);
        this.instantiationService.createInstance(ColorExtensionPoint);
        this.instantiationService.createInstance(LanguageConfigurationFileHandler);
    }
    ExtensionPoints = __decorate([
        __param(0, IInstantiationService)
    ], ExtensionPoints);
    return ExtensionPoints;
}());
export { ExtensionPoints };
Registry.as(WorkbenchExtensions.Workbench).registerWorkbenchContribution(ExtensionPoints, 1 /* Starting */);
