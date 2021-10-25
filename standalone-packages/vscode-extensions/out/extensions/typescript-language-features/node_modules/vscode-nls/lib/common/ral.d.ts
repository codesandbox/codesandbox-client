import { LocalizeFunc, LoadFunc, Options } from './common';
interface RAL {
    loadMessageBundle(file?: string): LocalizeFunc;
    config(opts?: Options): LoadFunc;
}
declare function RAL(): RAL;
declare namespace RAL {
    function install(ral: RAL): void;
}
export default RAL;
//# sourceMappingURL=ral.d.ts.map