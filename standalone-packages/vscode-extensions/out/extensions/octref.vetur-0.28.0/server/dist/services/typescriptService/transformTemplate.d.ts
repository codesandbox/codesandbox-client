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
/**
 * @param ts Loaded TS dependency
 * @param childComponentNamesInSnakeCase If `VElement`'s name matches one of the child components'
 * name, generate expression with `${componentHelperName}__${name}`, which will enforce type-check
 * on props
 */
export declare function getTemplateTransformFunctions(ts: T_TypeScript, childComponentNamesInSnakeCase?: string[]): {
    transformTemplate: (program: AST.ESLintProgram, code: string) => ts.Expression[];
    parseExpression: (exp: string, scope: string[], start: number) => ts.Expression;
};
