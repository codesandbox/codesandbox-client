interface IModule {
    exports: any;
}
interface IModuleMap {
    [path: string]: IModule;
}
interface IFactoryFunc {
    (require: IFactoryRequireFunc, module: IModule, exports: any): void;
}
interface IFactoryRequireFunc {
    (name: string): any;
}
declare let $map: IModuleMap;
declare function $load(name: string, factory: IFactoryFunc): void;
