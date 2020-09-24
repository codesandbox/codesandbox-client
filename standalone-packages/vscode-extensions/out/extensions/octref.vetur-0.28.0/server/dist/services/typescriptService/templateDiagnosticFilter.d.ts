import * as ts from 'typescript';
import { T_TypeScript } from '../dependencyService';
declare type DiagnosticFilter = (diagnostic: ts.Diagnostic) => boolean;
export declare function createTemplateDiagnosticFilter(tsModule: T_TypeScript): DiagnosticFilter;
export {};
