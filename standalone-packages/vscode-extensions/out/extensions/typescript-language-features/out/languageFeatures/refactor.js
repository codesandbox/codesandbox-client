"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = void 0;
const vscode = require("vscode");
const nls = require("vscode-nls");
const learnMoreAboutRefactorings_1 = require("../commands/learnMoreAboutRefactorings");
const typescriptService_1 = require("../typescriptService");
const api_1 = require("../utils/api");
const cancellation_1 = require("../utils/cancellation");
const dependentRegistration_1 = require("../utils/dependentRegistration");
const fileSchemes = require("../utils/fileSchemes");
const typeConverters = require("../utils/typeConverters");
const localize = nls.loadMessageBundle();
class DidApplyRefactoringCommand {
    constructor(telemetryReporter) {
        this.telemetryReporter = telemetryReporter;
        this.id = DidApplyRefactoringCommand.ID;
    }
    async execute(args) {
        /* __GDPR__
            "refactor.execute" : {
                "action" : { "classification": "PublicNonPersonalData", "purpose": "FeatureInsight" },
                "${include}": [
                    "${TypeScriptCommonProperties}"
                ]
            }
        */
        this.telemetryReporter.logTelemetry('refactor.execute', {
            action: args.codeAction.action,
        });
        if (!args.codeAction.edit?.size) {
            vscode.window.showErrorMessage(localize('refactoringFailed', "Could not apply refactoring"));
            return;
        }
        const renameLocation = args.codeAction.renameLocation;
        if (renameLocation) {
            // Disable renames in interactive playground https://github.com/microsoft/vscode/issues/75137
            if (args.codeAction.document.uri.scheme !== fileSchemes.walkThroughSnippet) {
                await vscode.commands.executeCommand('editor.action.rename', [
                    args.codeAction.document.uri,
                    typeConverters.Position.fromLocation(renameLocation)
                ]);
            }
        }
    }
}
DidApplyRefactoringCommand.ID = '_typescript.didApplyRefactoring';
class SelectRefactorCommand {
    constructor(client, didApplyCommand) {
        this.client = client;
        this.didApplyCommand = didApplyCommand;
        this.id = SelectRefactorCommand.ID;
    }
    async execute(args) {
        const file = this.client.toOpenedFilePath(args.document);
        if (!file) {
            return;
        }
        const selected = await vscode.window.showQuickPick(args.info.actions.map((action) => ({
            label: action.name,
            description: action.description,
        })));
        if (!selected) {
            return;
        }
        const tsAction = new InlinedCodeAction(this.client, args.action.title, args.action.kind, args.document, args.info.name, selected.label, args.rangeOrSelection);
        await tsAction.resolve(cancellation_1.nulToken);
        if (tsAction.edit) {
            if (!(await vscode.workspace.applyEdit(tsAction.edit))) {
                vscode.window.showErrorMessage(localize('refactoringFailed', "Could not apply refactoring"));
                return;
            }
        }
        await this.didApplyCommand.execute({ codeAction: tsAction });
    }
}
SelectRefactorCommand.ID = '_typescript.selectRefactoring';
const Extract_Function = Object.freeze({
    kind: vscode.CodeActionKind.RefactorExtract.append('function'),
    matches: refactor => refactor.name.startsWith('function_')
});
const Extract_Constant = Object.freeze({
    kind: vscode.CodeActionKind.RefactorExtract.append('constant'),
    matches: refactor => refactor.name.startsWith('constant_')
});
const Extract_Type = Object.freeze({
    kind: vscode.CodeActionKind.RefactorExtract.append('type'),
    matches: refactor => refactor.name.startsWith('Extract to type alias')
});
const Extract_Interface = Object.freeze({
    kind: vscode.CodeActionKind.RefactorExtract.append('interface'),
    matches: refactor => refactor.name.startsWith('Extract to interface')
});
const Move_NewFile = Object.freeze({
    kind: vscode.CodeActionKind.Refactor.append('move').append('newFile'),
    matches: refactor => refactor.name.startsWith('Move to a new file')
});
const Rewrite_Import = Object.freeze({
    kind: vscode.CodeActionKind.RefactorRewrite.append('import'),
    matches: refactor => refactor.name.startsWith('Convert namespace import') || refactor.name.startsWith('Convert named imports')
});
const Rewrite_Export = Object.freeze({
    kind: vscode.CodeActionKind.RefactorRewrite.append('export'),
    matches: refactor => refactor.name.startsWith('Convert default export') || refactor.name.startsWith('Convert named export')
});
const Rewrite_Arrow_Braces = Object.freeze({
    kind: vscode.CodeActionKind.RefactorRewrite.append('arrow').append('braces'),
    matches: refactor => refactor.name.startsWith('Convert default export') || refactor.name.startsWith('Convert named export')
});
const Rewrite_Parameters_ToDestructured = Object.freeze({
    kind: vscode.CodeActionKind.RefactorRewrite.append('parameters').append('toDestructured'),
    matches: refactor => refactor.name.startsWith('Convert parameters to destructured object')
});
const Rewrite_Property_GenerateAccessors = Object.freeze({
    kind: vscode.CodeActionKind.RefactorRewrite.append('property').append('generateAccessors'),
    matches: refactor => refactor.name.startsWith('Generate \'get\' and \'set\' accessors')
});
const allKnownCodeActionKinds = [
    Extract_Function,
    Extract_Constant,
    Extract_Type,
    Extract_Interface,
    Move_NewFile,
    Rewrite_Import,
    Rewrite_Export,
    Rewrite_Arrow_Braces,
    Rewrite_Parameters_ToDestructured,
    Rewrite_Property_GenerateAccessors
];
class InlinedCodeAction extends vscode.CodeAction {
    constructor(client, title, kind, document, refactor, action, range) {
        super(title, kind);
        this.client = client;
        this.document = document;
        this.refactor = refactor;
        this.action = action;
        this.range = range;
    }
    async resolve(token) {
        const file = this.client.toOpenedFilePath(this.document);
        if (!file) {
            return;
        }
        const args = {
            ...typeConverters.Range.toFileRangeRequestArgs(file, this.range),
            refactor: this.refactor,
            action: this.action,
        };
        const response = await this.client.execute('getEditsForRefactor', args, token);
        if (response.type !== 'response' || !response.body) {
            return;
        }
        // Resolve
        this.edit = InlinedCodeAction.getWorkspaceEditForRefactoring(this.client, response.body);
        this.renameLocation = response.body.renameLocation;
        return;
    }
    static getWorkspaceEditForRefactoring(client, body) {
        const workspaceEdit = new vscode.WorkspaceEdit();
        for (const edit of body.edits) {
            const resource = client.toResource(edit.fileName);
            if (resource.scheme === fileSchemes.file) {
                workspaceEdit.createFile(resource, { ignoreIfExists: true });
            }
        }
        typeConverters.WorkspaceEdit.withFileCodeEdits(workspaceEdit, client, body.edits);
        return workspaceEdit;
    }
}
class SelectCodeAction extends vscode.CodeAction {
    constructor(info, document, rangeOrSelection) {
        super(info.description, vscode.CodeActionKind.Refactor);
        this.command = {
            title: info.description,
            command: SelectRefactorCommand.ID,
            arguments: [{ action: this, document, info, rangeOrSelection }]
        };
    }
}
class TypeScriptRefactorProvider {
    constructor(client, formattingOptionsManager, commandManager, telemetryReporter) {
        this.client = client;
        this.formattingOptionsManager = formattingOptionsManager;
        const didApplyRefactoringCommand = commandManager.register(new DidApplyRefactoringCommand(telemetryReporter));
        commandManager.register(new SelectRefactorCommand(this.client, didApplyRefactoringCommand));
    }
    async provideCodeActions(document, rangeOrSelection, context, token) {
        if (!this.shouldTrigger(context, rangeOrSelection)) {
            return undefined;
        }
        if (!this.client.toOpenedFilePath(document)) {
            return undefined;
        }
        const response = await this.client.interruptGetErr(() => {
            const file = this.client.toOpenedFilePath(document);
            if (!file) {
                return undefined;
            }
            this.formattingOptionsManager.ensureConfigurationForDocument(document, token);
            const args = {
                ...typeConverters.Range.toFileRangeRequestArgs(file, rangeOrSelection),
                triggerReason: this.toTsTriggerReason(context),
                kind: context.only?.value
            };
            return this.client.execute('getApplicableRefactors', args, token);
        });
        if (response?.type !== 'response' || !response.body) {
            return undefined;
        }
        const actions = this.convertApplicableRefactors(response.body, document, rangeOrSelection).filter(action => {
            if (this.client.apiVersion.lt(api_1.default.v430)) {
                // Don't show 'infer return type' refactoring unless it has been explicitly requested
                // https://github.com/microsoft/TypeScript/issues/42993
                if (!context.only && action.kind?.value === 'refactor.rewrite.function.returnType') {
                    return false;
                }
            }
            return true;
        });
        if (!context.only) {
            return actions;
        }
        return this.pruneInvalidActions(this.appendInvalidActions(actions), context.only, /* numberOfInvalid = */ 5);
    }
    async resolveCodeAction(codeAction, token) {
        if (codeAction instanceof InlinedCodeAction) {
            await codeAction.resolve(token);
        }
        return codeAction;
    }
    toTsTriggerReason(context) {
        if (context.triggerKind === vscode.CodeActionTriggerKind.Invoke) {
            return 'invoked';
        }
        return undefined;
    }
    convertApplicableRefactors(body, document, rangeOrSelection) {
        const actions = [];
        for (const info of body) {
            if (info.inlineable === false) {
                const codeAction = new SelectCodeAction(info, document, rangeOrSelection);
                actions.push(codeAction);
            }
            else {
                for (const action of info.actions) {
                    actions.push(this.refactorActionToCodeAction(action, document, info, rangeOrSelection, info.actions));
                }
            }
        }
        return actions;
    }
    refactorActionToCodeAction(action, document, info, rangeOrSelection, allActions) {
        const codeAction = new InlinedCodeAction(this.client, action.description, TypeScriptRefactorProvider.getKind(action), document, info.name, action.name, rangeOrSelection);
        // https://github.com/microsoft/TypeScript/pull/37871
        if (action.notApplicableReason) {
            codeAction.disabled = { reason: action.notApplicableReason };
        }
        else {
            codeAction.command = {
                title: action.description,
                command: DidApplyRefactoringCommand.ID,
                arguments: [{ codeAction }],
            };
        }
        codeAction.isPreferred = TypeScriptRefactorProvider.isPreferred(action, allActions);
        return codeAction;
    }
    shouldTrigger(context, rangeOrSelection) {
        if (context.only && !vscode.CodeActionKind.Refactor.contains(context.only)) {
            return false;
        }
        if (context.triggerKind === vscode.CodeActionTriggerKind.Invoke) {
            return true;
        }
        return rangeOrSelection instanceof vscode.Selection;
    }
    static getKind(refactor) {
        if (refactor.kind) {
            return vscode.CodeActionKind.Empty.append(refactor.kind);
        }
        const match = allKnownCodeActionKinds.find(kind => kind.matches(refactor));
        return match ? match.kind : vscode.CodeActionKind.Refactor;
    }
    static isPreferred(action, allActions) {
        if (Extract_Constant.matches(action)) {
            // Only mark the action with the lowest scope as preferred
            const getScope = (name) => {
                const scope = name.match(/scope_(\d)/)?.[1];
                return scope ? +scope : undefined;
            };
            const scope = getScope(action.name);
            if (typeof scope !== 'number') {
                return false;
            }
            return allActions
                .filter(otherAtion => otherAtion !== action && Extract_Constant.matches(otherAtion))
                .every(otherAction => {
                const otherScope = getScope(otherAction.name);
                return typeof otherScope === 'number' ? scope < otherScope : true;
            });
        }
        if (Extract_Type.matches(action) || Extract_Interface.matches(action)) {
            return true;
        }
        return false;
    }
    appendInvalidActions(actions) {
        if (this.client.apiVersion.gte(api_1.default.v400)) {
            // Invalid actions come from TS server instead
            return actions;
        }
        if (!actions.some(action => action.kind && Extract_Constant.kind.contains(action.kind))) {
            const disabledAction = new vscode.CodeAction(localize('extractConstant.disabled.title', "Extract to constant"), Extract_Constant.kind);
            disabledAction.disabled = {
                reason: localize('extractConstant.disabled.reason', "The current selection cannot be extracted"),
            };
            disabledAction.isPreferred = true;
            actions.push(disabledAction);
        }
        if (!actions.some(action => action.kind && Extract_Function.kind.contains(action.kind))) {
            const disabledAction = new vscode.CodeAction(localize('extractFunction.disabled.title', "Extract to function"), Extract_Function.kind);
            disabledAction.disabled = {
                reason: localize('extractFunction.disabled.reason', "The current selection cannot be extracted"),
            };
            actions.push(disabledAction);
        }
        return actions;
    }
    pruneInvalidActions(actions, only, numberOfInvalid) {
        if (this.client.apiVersion.lt(api_1.default.v400)) {
            // Older TS version don't return extra actions
            return actions;
        }
        const availableActions = [];
        const invalidCommonActions = [];
        const invalidUncommonActions = [];
        for (const action of actions) {
            if (!action.disabled) {
                availableActions.push(action);
                continue;
            }
            // These are the common refactors that we should always show if applicable.
            if (action.kind && (Extract_Constant.kind.contains(action.kind) || Extract_Function.kind.contains(action.kind))) {
                invalidCommonActions.push(action);
                continue;
            }
            // These are the remaining refactors that we can show if we haven't reached the max limit with just common refactors.
            invalidUncommonActions.push(action);
        }
        const prioritizedActions = [];
        prioritizedActions.push(...invalidCommonActions);
        prioritizedActions.push(...invalidUncommonActions);
        const topNInvalid = prioritizedActions.filter(action => !only || (action.kind && only.contains(action.kind))).slice(0, numberOfInvalid);
        availableActions.push(...topNInvalid);
        return availableActions;
    }
}
TypeScriptRefactorProvider.minVersion = api_1.default.v240;
TypeScriptRefactorProvider.metadata = {
    providedCodeActionKinds: [
        vscode.CodeActionKind.Refactor,
        ...allKnownCodeActionKinds.map(x => x.kind),
    ],
    documentation: [
        {
            kind: vscode.CodeActionKind.Refactor,
            command: {
                command: learnMoreAboutRefactorings_1.LearnMoreAboutRefactoringsCommand.id,
                title: localize('refactor.documentation.title', "Learn more about JS/TS refactorings")
            }
        }
    ]
};
function register(selector, client, formattingOptionsManager, commandManager, telemetryReporter) {
    return (0, dependentRegistration_1.conditionalRegistration)([
        (0, dependentRegistration_1.requireMinVersion)(client, TypeScriptRefactorProvider.minVersion),
        (0, dependentRegistration_1.requireSomeCapability)(client, typescriptService_1.ClientCapability.Semantic),
    ], () => {
        return vscode.languages.registerCodeActionsProvider(selector.semantic, new TypeScriptRefactorProvider(client, formattingOptionsManager, commandManager, telemetryReporter), TypeScriptRefactorProvider.metadata);
    });
}
exports.register = register;
//# sourceMappingURL=refactor.js.map