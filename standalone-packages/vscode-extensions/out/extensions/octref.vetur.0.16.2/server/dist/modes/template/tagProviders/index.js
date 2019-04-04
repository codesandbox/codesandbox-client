"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const htmlTags_1 = require("./htmlTags");
const vueTags_1 = require("./vueTags");
const routerTags_1 = require("./routerTags");
const externalTagProviders_1 = require("./externalTagProviders");
var componentInfoTagProvider_1 = require("./componentInfoTagProvider");
exports.getComponentTags = componentInfoTagProvider_1.getComponentInfoTagProvider;
const ts = require("typescript");
const fs = require("fs");
const path_1 = require("path");
const nuxtTags_1 = require("./nuxtTags");
exports.allTagProviders = [
    htmlTags_1.getHTML5TagProvider(),
    vueTags_1.getVueTagProvider(),
    routerTags_1.getRouterTagProvider(),
    externalTagProviders_1.elementTagProvider,
    externalTagProviders_1.onsenTagProvider,
    externalTagProviders_1.bootstrapTagProvider,
    externalTagProviders_1.buefyTagProvider,
    externalTagProviders_1.vuetifyTagProvider
];
function getTagProviderSettings(workspacePath) {
    const settings = {
        html5: true,
        vue: true,
        router: false,
        element: false,
        onsen: false,
        bootstrap: false,
        buefy: false,
        vuetify: false,
        quasar: false,
        nuxt: false
    };
    if (!workspacePath) {
        return settings;
    }
    try {
        const packagePath = ts.findConfigFile(workspacePath, ts.sys.fileExists, 'package.json');
        if (!packagePath) {
            return settings;
        }
        const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));
        if (packageJson.dependencies['vue-router']) {
            settings['router'] = true;
        }
        if (packageJson.dependencies['element-ui']) {
            settings['element'] = true;
        }
        if (packageJson.dependencies['vue-onsenui']) {
            settings['onsen'] = true;
        }
        if (packageJson.dependencies['bootstrap-vue']) {
            settings['bootstrap'] = true;
        }
        if (packageJson.dependencies['buefy']) {
            settings['buefy'] = true;
        }
        if (packageJson.dependencies['vuetify']) {
            settings['vuetify'] = true;
        }
        if (packageJson.dependencies['nuxt'] ||
            packageJson.dependencies['nuxt-legacy'] ||
            packageJson.dependencies['nuxt-edge']) {
            const nuxtTagProvider = nuxtTags_1.getNuxtTagProvider(workspacePath);
            if (nuxtTagProvider) {
                settings['nuxt'] = true;
                exports.allTagProviders.push(nuxtTagProvider);
            }
        }
        for (const dep in packageJson.dependencies) {
            const runtimePkgPath = ts.findConfigFile(workspacePath, ts.sys.fileExists, path_1.join('node_modules', dep, 'package.json'));
            if (!runtimePkgPath) {
                continue;
            }
            const runtimePkg = JSON.parse(fs.readFileSync(runtimePkgPath, 'utf-8'));
            if (!runtimePkg) {
                continue;
            }
            const tagProvider = externalTagProviders_1.getRuntimeTagProvider(workspacePath, runtimePkg);
            if (!tagProvider) {
                continue;
            }
            exports.allTagProviders.push(tagProvider);
            settings[dep] = true;
        }
    }
    catch (e) { }
    return settings;
}
exports.getTagProviderSettings = getTagProviderSettings;
function getEnabledTagProviders(tagProviderSetting) {
    return exports.allTagProviders.filter(p => tagProviderSetting[p.getId()] !== false);
}
exports.getEnabledTagProviders = getEnabledTagProviders;
//# sourceMappingURL=index.js.map