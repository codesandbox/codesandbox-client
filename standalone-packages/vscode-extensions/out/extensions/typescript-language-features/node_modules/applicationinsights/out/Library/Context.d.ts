import Contracts = require("../Declarations/Contracts");
declare class Context {
    keys: Contracts.ContextTagKeys;
    tags: {
        [key: string]: string;
    };
    static DefaultRoleName: string;
    static appVersion: {
        [path: string]: string;
    };
    static sdkVersion: string;
    constructor(packageJsonPath?: string);
    private _loadApplicationContext(packageJsonPath?);
    private _loadDeviceContext();
    private _loadInternalContext();
}
export = Context;
