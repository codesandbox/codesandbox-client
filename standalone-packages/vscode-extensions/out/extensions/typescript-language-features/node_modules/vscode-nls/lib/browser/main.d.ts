import { Options, LocalizeInfo } from '../common/common';
export { MessageFormat, BundleFormat, Options, LocalizeInfo, LocalizeFunc, LoadFunc, KeyInfo } from '../common/common';
export declare function loadMessageBundle(_file?: string): (key: string | number | LocalizeInfo, message: string, ...args: any[]) => string;
export declare function config(options?: Options): typeof loadMessageBundle;
//# sourceMappingURL=main.d.ts.map