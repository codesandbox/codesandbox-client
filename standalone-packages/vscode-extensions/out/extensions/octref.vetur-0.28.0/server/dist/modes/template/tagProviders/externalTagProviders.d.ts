import { IHTMLTagProvider } from './common';
export declare const elementTagProvider: IHTMLTagProvider;
export declare const onsenTagProvider: IHTMLTagProvider;
export declare const bootstrapTagProvider: IHTMLTagProvider;
export declare const gridsomeTagProvider: IHTMLTagProvider;
/**
 * Get tag providers specified in workspace root's packaage.json
 */
export declare function getWorkspaceTagProvider(workspacePath: string, rootPkgJson: any): IHTMLTagProvider | null;
/**
 * Get tag providers specified in packaage.json's `vetur` key
 */
export declare function getDependencyTagProvider(workspacePath: string, depPkgJson: any): IHTMLTagProvider | null;
export declare function getExternalTagProvider(id: string, tags: any, attributes: any): IHTMLTagProvider;
