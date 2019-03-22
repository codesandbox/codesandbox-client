import { IHTMLTagProvider } from './common';
export declare const elementTagProvider: IHTMLTagProvider;
export declare const onsenTagProvider: IHTMLTagProvider;
export declare const bootstrapTagProvider: IHTMLTagProvider;
export declare const buefyTagProvider: IHTMLTagProvider;
export declare const vuetifyTagProvider: IHTMLTagProvider;
export declare function getRuntimeTagProvider(workspacePath: string, pkg: any): IHTMLTagProvider | null;
export declare function getExternalTagProvider(id: string, tags: any, attributes: any): IHTMLTagProvider;
