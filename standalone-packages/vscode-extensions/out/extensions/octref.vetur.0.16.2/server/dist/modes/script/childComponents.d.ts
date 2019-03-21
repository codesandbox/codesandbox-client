import * as ts from 'typescript';
interface InternalChildComponent {
    name: string;
    documentation?: string;
    definition?: {
        path: string;
        start: number;
        end: number;
    };
    defaultExportExpr?: ts.Node;
}
export declare function getChildComponents(defaultExportType: ts.Type, checker: ts.TypeChecker, tagCasing?: string): InternalChildComponent[] | undefined;
export {};
