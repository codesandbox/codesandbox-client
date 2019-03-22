import * as ts from 'typescript';
import { VueFileInfo } from '../../services/vueInfoService';
export declare function getComponentInfo(service: ts.LanguageService, fileFsPath: string, config: any): VueFileInfo | undefined;
export declare function analyzeDefaultExportExpr(defaultExportExpr: ts.Node, checker: ts.TypeChecker): VueFileInfo;
export declare function getObjectLiteralExprFromExportExpr(exportExpr: ts.Node): ts.Expression | undefined;
export declare function getLastChild(d: ts.Declaration): ts.Node | undefined;
export declare function buildDocumentation(s: ts.Symbol, checker: ts.TypeChecker): string;
