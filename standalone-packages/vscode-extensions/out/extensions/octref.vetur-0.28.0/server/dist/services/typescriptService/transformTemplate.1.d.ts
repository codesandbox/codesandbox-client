import * as ts from 'typescript';
import { AST } from 'vue-eslint-parser';
import { T_TypeScript } from '../dependencyService';
export declare const renderHelperName = "__vlsRenderHelper";
export declare const componentHelperName = "__vlsComponentHelper";
export declare const iterationHelperName = "__vlsIterationHelper";
export declare const componentDataName = "__vlsComponentData";
/**
 * Allowed global variables in templates.
 * Borrowed from: https://github.com/vuejs/vue/blob/dev/src/core/instance/proxy.js
 */
export declare const globalScope: string[];
export declare function getTemplateTransformFunctions(ts: T_TypeScript): {
    transformTemplate: (program: AST.ESLintProgram, code: string) => ts.Expression[];
    parseExpression: (exp: string, scope: string[], start: number) => ts.Expression;
};
