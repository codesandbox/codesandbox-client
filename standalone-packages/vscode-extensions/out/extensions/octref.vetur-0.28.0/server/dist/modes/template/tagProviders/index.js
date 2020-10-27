"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEnabledTagProviders = exports.getTagProviderSettings = exports.allTagProviders = void 0;
const htmlTags_1 = require("./htmlTags");
const vueTags_1 = require("./vueTags");
const routerTags_1 = require("./routerTags");
const externalTagProviders_1 = require("./externalTagProviders");
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
    externalTagProviders_1.gridsomeTagProvider
];
function getTagProviderSettings(workspacePath) {
    const settings = {
        '__vetur-workspace': true,
        html5: true,
        vue: true,
        router: false,
        element: false,
        onsen: false,
        bootstrap: false,
        buefy: false,
        vuetify: false,
        quasar: false,
        'quasar-framework': false,
        nuxt: false,
        gridsome: false
    };
    if (!workspacePath) {
        return settings;
    }
    try {
        const packagePath = ts.findConfigFile(workspacePath, ts.sys.fileExists, 'package.json');
        if (!packagePath) {
            return settings;
        }
        const rootPkgJson = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));
        const dependencies = rootPkgJson.dependencies || {};
        const devDependencies = rootPkgJson.devDependencies || {};
        if (dependencies['vue-router'] || devDependencies['vue-router']) {
            settings['vue-router'] = true;
        }
        if (dependencies['element-ui'] || devDependencies['element-ui']) {
            settings['element'] = true;
        }
        if (dependencies['vue-onsenui'] || devDependencies['vue-onsenui']) {
            settings['onsen'] = true;
        }
        if (dependencies['bootstrap-vue'] || devDependencies['bootstrap-vue']) {
            settings['bootstrap'] = true;
        }
        if (dependencies['buefy'] || devDependencies['buefy']) {
            settings['buefy'] = true;
        }
        if (dependencies['nuxt-buefy'] || devDependencies['nuxt-buefy']) {
            dependencies['buefy'] = true;
        }
        if (dependencies['vuetify'] || devDependencies['vuetify']) {
            settings['vuetify'] = true;
        }
        if (dependencies['@nuxtjs/vuetify'] || devDependencies['@nuxtjs/vuetify']) {
            dependencies['vuetify'] = true;
        }
        // Quasar v1+:
        if (dependencies['quasar'] || devDependencies['quasar']) {
            settings['quasar'] = true;
        }
        // Quasar pre v1 on non quasar-cli:
        if (dependencies['quasar-framework']) {
            settings['quasar-framework'] = true;
        }
        // Quasar pre v1 on quasar-cli:
        if (devDependencies['quasar-cli']) {
            // pushing dependency so we can check it
            // and enable Quasar later below in the for()
            dependencies['quasar-framework'] = '^0.0.17';
        }
        if (dependencies['nuxt'] || dependencies['nuxt-edge'] || devDependencies['nuxt'] || devDependencies['nuxt-edge']) {
            const nuxtTagProvider = nuxtTags_1.getNuxtTagProvider(workspacePath);
            if (nuxtTagProvider) {
                settings['nuxt'] = true;
                exports.allTagProviders.push(nuxtTagProvider);
            }
        }
        if (dependencies['gridsome']) {
            settings['gridsome'] = true;
        }
        const workspaceTagProvider = externalTagProviders_1.getWorkspaceTagProvider(workspacePath, rootPkgJson);
        if (workspaceTagProvider) {
            exports.allTagProviders.push(workspaceTagProvider);
        }
        for (const dep of [...Object.keys(dependencies), ...Object.keys(devDependencies)]) {
            const runtimePkgJsonPath = ts.findConfigFile(workspacePath, ts.sys.fileExists, path_1.join('node_modules', dep, 'package.json'));
            if (!runtimePkgJsonPath) {
                continue;
            }
            const runtimePkgJson = JSON.parse(fs.readFileSync(runtimePkgJsonPath, 'utf-8'));
            if (!runtimePkgJson) {
                continue;
            }
            const depTagProvider = externalTagProviders_1.getDependencyTagProvider(workspacePath, runtimePkgJson);
            if (!depTagProvider) {
                continue;
            }
            exports.allTagProviders.push(depTagProvider);
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