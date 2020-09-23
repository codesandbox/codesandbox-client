import * as ts from 'typescript';
import { T_TypeScript } from '../../services/dependencyService';
interface InternalChildComponent {
    name: string;
    documentation?: string;
    definition?: {
        path: string;
        start: number;
        end: number;
    };
    defaultExportNode?: ts.Node;
}
export declare function getChildComponents(tsModule: T_TypeScript, defaultExportType: ts.Type, checker: ts.TypeChecker, tagCasing?: string): InternalChildComponent[] | undefined;
export {};
