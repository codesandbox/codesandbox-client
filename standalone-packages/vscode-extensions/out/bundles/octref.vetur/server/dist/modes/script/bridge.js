"use strict";
// this bridge file will be injected into TypeScript service
// it enable type checking and completion, yet still preserve precise option type
Object.defineProperty(exports, "__esModule", { value: true });
exports.moduleName = 'vue-editor-bridge';
exports.fileName = 'vue-temp/vue-editor-bridge.ts';
exports.oldContent = `
import Vue from 'vue';
export interface GeneralOption extends Vue.ComponentOptions<Vue> {
  [key: string]: any;
}
export default function bridge<T>(t: T & GeneralOption): T {
  return t;
}`;
exports.content = `
import Vue from 'vue';
const func = Vue.extend;
export default func;
`;
//# sourceMappingURL=bridge.js.map