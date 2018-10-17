import { SyncActionDescriptor, MenuRegistry, MenuId, } from '../../../platform/actions/common/actions.js';
import { URI } from '../../../base/common/uri.js';
import { Registry } from '../../../platform/registry/common/platform.js';
import { Extensions as ActionExtensions, } from '../../../workbench/common/actions.js';
import { KeyChord } from '../../../base/common/keyCodes.js';
import { CodeSandboxTogglePreviewAction, CodeSandboxSetThemeAction, CodeSandboxOpenPreviewExternalAction, CodeSandboxAddDependencyAction, } from './codesandboxActions.js';
var registry = Registry.as(ActionExtensions.WorkbenchActions);
registry.registerWorkbenchAction(new SyncActionDescriptor(CodeSandboxTogglePreviewAction, CodeSandboxTogglePreviewAction.ID, CodeSandboxTogglePreviewAction.LABEL, { primary: 2048 /* CtrlCmd */ | 1024 /* Shift */ | 34 /* KEY_D */ }), 'CodeSandbox: Toggle Preview', 'CodeSandbox');
registry.registerWorkbenchAction(new SyncActionDescriptor(CodeSandboxOpenPreviewExternalAction, CodeSandboxOpenPreviewExternalAction.ID, CodeSandboxOpenPreviewExternalAction.LABEL, { primary: 0 }), 'CodeSandbox: Open Preview In New Window', 'CodeSandbox');
registry.registerWorkbenchAction(new SyncActionDescriptor(CodeSandboxSetThemeAction, CodeSandboxSetThemeAction.ID, CodeSandboxSetThemeAction.LABEL, {
    primary: KeyChord(2048 /* CtrlCmd */ | 41 /* KEY_K */, 2048 /* CtrlCmd */ | 50 /* KEY_T */),
}), 'Preferences: Color Theme', 'Preferences');
registry.registerWorkbenchAction(new SyncActionDescriptor(CodeSandboxAddDependencyAction, CodeSandboxAddDependencyAction.ID, CodeSandboxAddDependencyAction.LABEL, {
    primary: 0
}), 'CodeSandbox: Add NPM Dependency', 'CodeSandbox');
function appendEditorToolItem(primary, order) {
    var item = {
        command: {
            id: primary.id,
            title: primary.title,
            iconLocation: {
                dark: URI.parse(require.toUrl("vs/codesandbox/services/codesandbox/assets/preview.svg")),
                light: URI.parse(require.toUrl("vs/codesandbox/services/codesandbox/assets/preview-dark.svg")),
            },
        },
        group: 'navigation',
        order: order,
    };
    MenuRegistry.appendMenuItem(MenuId.EditorTitle, item);
}
appendEditorToolItem({
    id: CodeSandboxTogglePreviewAction.ID,
    title: CodeSandboxTogglePreviewAction.LABEL,
}, 10000);
