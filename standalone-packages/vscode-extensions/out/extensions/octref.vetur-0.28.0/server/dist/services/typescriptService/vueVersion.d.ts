import { T_TypeScript } from '../dependencyService';
export declare enum VueVersion {
    VPre25 = 0,
    V25 = 1,
    V30 = 2
}
export declare function inferVueVersion(tsModule: T_TypeScript, workspacePath: string): VueVersion;
