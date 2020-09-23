"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.vue25Content = exports.fileName = exports.moduleName = void 0;
const transformTemplate_1 = require("./transformTemplate");
// This bridge file will be injected into TypeScript language service
// it enable type checking and completion, yet still preserve precise option type
exports.moduleName = 'vue-editor-bridge';
exports.fileName = 'vue-temp/vue-editor-bridge.ts';
const renderHelpers = `
type ComponentListeners<T> = {
  [K in keyof T]?: ($event: T[K]) => any;
};
interface ComponentData<T> {
  props: Record<string, any>;
  on: ComponentListeners<T>;
  directives: any[];
}
export declare const ${transformTemplate_1.renderHelperName}: {
  <T>(Component: (new (...args: any[]) => T), fn: (this: T) => any): any;
};
export declare const ${transformTemplate_1.componentHelperName}: {
  <T>(
    vm: T,
    tag: string,
    data: ComponentData<Record<string, any>> & ThisType<T>,
    children: any[]
  ): any;
};
export declare const ${transformTemplate_1.iterationHelperName}: {
  <T>(list: readonly T[], fn: (value: T, index: number) => any): any;
  <T>(obj: { [key: string]: T }, fn: (value: T, key: string, index: number) => any): any;
  (num: number, fn: (value: number) => any): any;
  <T>(obj: object, fn: (value: any, key: string, index: number) => any): any;
};
`;
exports.vue25Content = `
import Vue from 'vue';
const func = Vue.extend;
export default func;
` + renderHelpers;
//# sourceMappingURL=bridge2.js.map