"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDefaultVLSConfig = void 0;
function getDefaultVLSConfig() {
    return {
        vetur: {
            useWorkspaceDependencies: false,
            validation: {
                template: true,
                templateProps: false,
                interpolation: true,
                style: true,
                script: true
            },
            completion: {
                autoImport: false,
                tagCasing: 'initial',
                scaffoldSnippetSources: {
                    workspace: '💼',
                    user: '🗒️',
                    vetur: '✌'
                }
            },
            grammar: {
                customBlocks: {}
            },
            format: {
                enable: true,
                options: {
                    tabSize: 2,
                    useTabs: false
                },
                defaultFormatter: {},
                defaultFormatterOptions: {},
                scriptInitialIndent: false,
                styleInitialIndent: false
            },
            languageFeatures: {
                codeActions: true
            },
            trace: {
                server: 'off'
            },
            dev: {
                vlsPath: '',
                vlsPort: -1,
                logLevel: 'INFO'
            },
            experimental: {
                templateInterpolationService: false
            }
        },
        css: {},
        html: {
            suggest: {}
        },
        javascript: {
            format: {}
        },
        typescript: {
            tsdk: null,
            format: {}
        },
        emmet: {},
        stylusSupremacy: {}
    };
}
exports.getDefaultVLSConfig = getDefaultVLSConfig;
//# sourceMappingURL=config.js.map