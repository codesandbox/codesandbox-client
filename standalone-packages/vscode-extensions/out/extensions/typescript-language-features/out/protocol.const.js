"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
class Kind {
}
Kind.alias = 'alias';
Kind.callSignature = 'call';
Kind.class = 'class';
Kind.const = 'const';
Kind.constructorImplementation = 'constructor';
Kind.constructSignature = 'construct';
Kind.directory = 'directory';
Kind.enum = 'enum';
Kind.externalModuleName = 'external module name';
Kind.function = 'function';
Kind.indexSignature = 'index';
Kind.interface = 'interface';
Kind.keyword = 'keyword';
Kind.let = 'let';
Kind.localFunction = 'local function';
Kind.localVariable = 'local var';
Kind.memberFunction = 'method';
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
exports.Kind = Kind;
class DiagnosticCategory {
}
DiagnosticCategory.error = 'error';
DiagnosticCategory.warning = 'warning';
DiagnosticCategory.suggestion = 'suggestion';
exports.DiagnosticCategory = DiagnosticCategory;
class KindModifiers {
}
KindModifiers.optional = 'optional';
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
exports.KindModifiers = KindModifiers;
class DisplayPartKind {
}
DisplayPartKind.functionName = 'functionName';
DisplayPartKind.methodName = 'methodName';
DisplayPartKind.parameterName = 'parameterName';
DisplayPartKind.propertyName = 'propertyName';
DisplayPartKind.punctuation = 'punctuation';
DisplayPartKind.text = 'text';
exports.DisplayPartKind = DisplayPartKind;
//# sourceMappingURL=protocol.const.js.map