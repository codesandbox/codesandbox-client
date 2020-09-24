"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.vue30Content = exports.vue25Content = exports.preVue25Content = exports.fileName = exports.moduleName = void 0;
const transformTemplate_1 = require("./transformTemplate");
// This bridge file will be injected into TypeScript language service
// it enable type checking and completion, yet still preserve precise option type
exports.moduleName = 'vue-editor-bridge';
exports.fileName = 'vue-temp/vue-editor-bridge.ts';
const renderHelpers = `
type ComponentListeners<T> = {
  [K in keyof T]?: ($event: T[K]) => any;
};
export interface ${transformTemplate_1.componentDataName}<T> {
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
    data: ${transformTemplate_1.componentDataName}<Record<string, any>> & ThisType<T>,
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
exports.preVue25Content = `
import Vue from 'vue';
export interface GeneralOption extends Vue.ComponentOptions<Vue> {
  [key: string]: any;
}
export default function bridge<T>(t: T & GeneralOption): T {
  return t;
}
` + renderHelpers;
exports.vue25Content = `
import Vue from 'vue';
const func = Vue.extend;
export default func;
` + renderHelpers;
exports.vue30Content = `
import { defineComponent } from 'vue';
const func = defineComponent;
export default func;
` + renderHelpers;
//# sourceMappingURL=bridge.js.map