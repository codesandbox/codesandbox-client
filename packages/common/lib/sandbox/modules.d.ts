import { Module, Directory } from '../types';
export declare function resolveDirectory(_path: string | undefined, modules: Array<Module>, directories: Array<Directory>, _startdirectoryShortid?: string | undefined): Directory;
export declare function getModulesInDirectory(_path: string | undefined, modules: Array<Module>, directories: Array<Directory>, _startdirectoryShortid?: string | undefined): {
    modules: Module[];
    foundDirectoryShortid: string;
    lastPath: string;
    splitPath: string[];
};
/**
 * Convert the module path to a module
 */
export declare const resolveModule: (path: string, modules: Module[], directories: Directory[], startdirectoryShortid?: string, ignoredExtensions?: string[]) => Module;
export declare const getModulePath: any;
export declare const isMainModule: (module: Module, modules: Module[], directories: Directory[], entry?: string) => boolean;
export declare const findMainModule: (modules: Module[], directories: Directory[], entry?: string) => Module;
export declare const findCurrentModule: (modules: Module[], directories: Directory[], modulePath: string, mainModule: Module) => Module;
