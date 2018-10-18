import { TPromise } from '../base/common/winjs.base';
var DefaultPanel = /** @class */ (function () {
    function DefaultPanel() {
    }
    DefaultPanel.prototype.getId = function () {
        return 'panel';
    };
    DefaultPanel.prototype.getTitle = function () {
        return 'codesandboxPanel';
    };
    DefaultPanel.prototype.getActions = function () {
        console.log('getActions');
        return [];
    };
    DefaultPanel.prototype.getSecondaryActions = function () {
        console.log('getSecondaryActions');
        return [];
    };
    DefaultPanel.prototype.getContextMenuActions = function () {
        console.log('getContextMenuActions');
        return [];
    };
    DefaultPanel.prototype.getActionItem = function (action) {
        throw new Error('getActionItem');
    };
    DefaultPanel.prototype.getControl = function () {
        throw new Error('getControl');
    };
    DefaultPanel.prototype.focus = function () {
        console.log('focus');
    };
    return DefaultPanel;
}());
var panel = new DefaultPanel();
var CodeSandboxPanelService = /** @class */ (function () {
    function CodeSandboxPanelService() {
    }
    CodeSandboxPanelService.prototype.openPanel = function (id, focus) {
        console.log('openPanel', id, focus);
        return new TPromise(function (r) { return r(panel); });
    };
    CodeSandboxPanelService.prototype.getActivePanel = function () {
        return panel;
    };
    CodeSandboxPanelService.prototype.getPanels = function () {
        return [
            {
                id: 'codesandboxPanel',
                name: 'CodeSandbox Panel',
                cssClass: 'csb',
            },
        ];
    };
    CodeSandboxPanelService.prototype.setPanelEnablement = function (id, enabled) {
        console.log('setPanelEnablement', id, enabled);
    };
    return CodeSandboxPanelService;
}());
export { CodeSandboxPanelService };
