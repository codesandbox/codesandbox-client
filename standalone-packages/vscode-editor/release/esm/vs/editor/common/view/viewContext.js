/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var ViewContext = /** @class */ (function () {
    function ViewContext(configuration, theme, model, privateViewEventBus) {
        this.configuration = configuration;
        this.theme = theme;
        this.model = model;
        this.viewLayout = model.viewLayout;
        this.privateViewEventBus = privateViewEventBus;
    }
    ViewContext.prototype.addEventHandler = function (eventHandler) {
        this.privateViewEventBus.addEventHandler(eventHandler);
    };
    ViewContext.prototype.removeEventHandler = function (eventHandler) {
        this.privateViewEventBus.removeEventHandler(eventHandler);
    };
    return ViewContext;
}());
export { ViewContext };
