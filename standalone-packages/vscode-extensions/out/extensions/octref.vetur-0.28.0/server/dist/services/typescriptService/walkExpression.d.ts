import * as ts from 'typescript';
import { T_TypeScript } from '../dependencyService';
/**
 * Walk all descendant expressions included root node naively. Not comprehensive walker.
 * Traversal type is post-order (LRN).
 * If some expression node is returned in predicate function, the node will be replaced.
 */
export declare function walkExpression(ts: T_TypeScript, root: ts.Expression, predicate: (node: ts.Expression, additionalScope: ts.Identifier[]) => ts.Expression | void): ts.Expression;
