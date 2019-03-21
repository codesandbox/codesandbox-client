export declare const moduleName = "vue-editor-bridge";
export declare const fileName = "vue-temp/vue-editor-bridge.ts";
export declare const oldContent = "\nimport Vue from 'vue';\nexport interface GeneralOption extends Vue.ComponentOptions<Vue> {\n  [key: string]: any;\n}\nexport default function bridge<T>(t: T & GeneralOption): T {\n  return t;\n}";
export declare const content = "\nimport Vue from 'vue';\nconst func = Vue.extend;\nexport default func;\n";
