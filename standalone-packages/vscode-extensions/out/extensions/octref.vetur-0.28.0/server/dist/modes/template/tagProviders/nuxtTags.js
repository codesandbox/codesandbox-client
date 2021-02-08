"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNuxtTagProvider = void 0;
const path_1 = require("path");
const externalTagProviders_1 = require("./externalTagProviders");
const NUXT_JSON_SOURCES = ['@nuxt/vue-app-edge', '@nuxt/vue-app', 'nuxt-helper-json'];
function getNuxtTagProvider(workspacePath) {
    let nuxtTags, nuxtAttributes;
    for (const source of NUXT_JSON_SOURCES) {
        if (tryResolve(path_1.join(source, 'package.json'), workspacePath)) {
            nuxtTags = tryRequire(path_1.join(source, 'vetur/nuxt-tags.json'), workspacePath);
            nuxtAttributes = tryRequire(path_1.join(source, 'vetur/nuxt-attributes.json'), workspacePath);
            if (nuxtTags) {
                break;
            }
        }
    }
    const componentsTags = tryRequire(path_1.join(workspacePath, '.nuxt/vetur/tags.json'), workspacePath);
    const componentsAttributes = tryRequire(path_1.join(workspacePath, '.nuxt/vetur/attributes.json'), workspacePath);
    return externalTagProviders_1.getExternalTagProvider('nuxt', Object.assign(Object.assign({}, nuxtTags), componentsTags), Object.assign(Object.assign({}, nuxtAttributes), componentsAttributes));
}
exports.getNuxtTagProvider = getNuxtTagProvider;
function tryRequire(modulePath, workspacePath) {
    try {
        const resolved = tryResolve(modulePath, workspacePath);
        return resolved ? require(resolved) : undefined;
    }
    catch (_err) { }
}
function tryResolve(modulePath, workspacePath) {
    try {
        return require.resolve(modulePath, {
            paths: [workspacePath, __dirname]
        });
    }
    catch (_err) { }
}
//# sourceMappingURL=nuxtTags.js.map