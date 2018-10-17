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
import { IViewletService } from '../../../services/viewlet/browser/viewlet';
import { IPanelService } from '../../../services/panel/common/panelService';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration';
import { VIEW_ID } from '../../../../platform/search/common/search';
var SearchViewLocationUpdater = /** @class */ (function () {
    function SearchViewLocationUpdater(viewletService, panelService, configurationService) {
        var updateSearchViewLocation = function (open) {
            var config = configurationService.getValue();
            if (config.search.location === 'panel') {
                viewletService.setViewletEnablement(VIEW_ID, false);
                panelService.setPanelEnablement(VIEW_ID, true);
                if (open) {
                    panelService.openPanel(VIEW_ID);
                }
            }
            else {
                panelService.setPanelEnablement(VIEW_ID, false);
                viewletService.setViewletEnablement(VIEW_ID, true);
                if (open) {
                    viewletService.openViewlet(VIEW_ID);
                }
            }
        };
        configurationService.onDidChangeConfiguration(function (e) {
            if (e.affectsConfiguration('search.location')) {
                updateSearchViewLocation(true);
            }
        });
        updateSearchViewLocation(false);
    }
    SearchViewLocationUpdater = __decorate([
        __param(0, IViewletService),
        __param(1, IPanelService),
        __param(2, IConfigurationService)
    ], SearchViewLocationUpdater);
    return SearchViewLocationUpdater;
}());
export { SearchViewLocationUpdater };
