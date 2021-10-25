"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventName = exports.DisplayPartKind = exports.KindModifiers = exports.DiagnosticCategory = exports.Kind = void 0;
class Kind {
}
exports.Kind = Kind;
Kind.alias = 'alias';
Kind.callSignature = 'call';
Kind.class = 'class';
Kind.const = 'const';
Kind.constructorImplementation = 'constructor';
Kind.constructSignature = 'construct';
Kind.directory = 'directory';
Kind.enum = 'enum';
Kind.enumMember = 'enum member';
Kind.externalModuleName = 'external module name';
Kind.function = 'function';
Kind.indexSignature = 'index';
Kind.interface = 'interface';
Kind.keyword = 'keyword';
Kind.let = 'let';
Kind.localFunction = 'local function';
Kind.localVariable = 'local var';
Kind.method = 'method';
Kind.memberGetAccessor = 'getter';
Kind.memberSetAccessor = 'setter';
Kind.memberVariable = 'property';
Kind.module = 'module';
Kind.primitiveType = 'primitive type';
Kind.script = 'script';
Kind.type = 'type';
Kind.variable = 'var';
Kind.warning = 'warning';
Kind.string = 'string';
Kind.parameter = 'parameter';
Kind.typeParameter = 'type parameter';
class DiagnosticCategory {
}
exports.DiagnosticCategory = DiagnosticCategory;
DiagnosticCategory.error = 'error';
DiagnosticCategory.warning = 'warning';
DiagnosticCategory.suggestion = 'suggestion';
class KindModifiers {
}
exports.KindModifiers = KindModifiers;
KindModifiers.optional = 'optional';
KindModifiers.deprecated = 'deprecated';
KindModifiers.color = 'color';
KindModifiers.dtsFile = '.d.ts';
KindModifiers.tsFile = '.ts';
KindModifiers.tsxFile = '.tsx';
KindModifiers.jsFile = '.js';
KindModifiers.jsxFile = '.jsx';
KindModifiers.jsonFile = '.json';
KindModifiers.fileExtensionKindModifiers = [
    KindModifiers.dtsFile,
    KindModifiers.tsFile,
    KindModifiers.tsxFile,
    KindModifiers.jsFile,
    KindModifiers.jsxFile,
    KindModifiers.jsonFile,
];
class DisplayPartKind {
}
exports.DisplayPartKind = DisplayPartKind;
DisplayPartKind.functionName = 'functionName';
DisplayPartKind.methodName = 'methodName';
DisplayPartKind.parameterName = 'parameterName';
DisplayPartKind.propertyName = 'propertyName';
DisplayPartKind.punctuation = 'punctuation';
DisplayPartKind.text = 'text';
var EventName;
(function (EventName) {
    EventName["syntaxDiag"] = "syntaxDiag";
    EventName["semanticDiag"] = "semanticDiag";
    EventName["suggestionDiag"] = "suggestionDiag";
    EventName["configFileDiag"] = "configFileDiag";
    EventName["telemetry"] = "telemetry";
    EventName["projectLanguageServiceState"] = "projectLanguageServiceState";
    EventName["projectsUpdatedInBackground"] = "projectsUpdatedInBackground";
    EventName["beginInstallTypes"] = "beginInstallTypes";
    EventName["endInstallTypes"] = "endInstallTypes";
    EventName["typesInstallerInitializationFailed"] = "typesInstallerInitializationFailed";
    EventName["surveyReady"] = "surveyReady";
    EventName["projectLoadingStart"] = "projectLoadingStart";
    EventName["projectLoadingFinish"] = "projectLoadingFinish";
})(EventName = exports.EventName || (exports.EventName = {}));
//# sourceMappingURL=protocol.const.js.map