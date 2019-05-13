import { ConfigurationFile } from '../types';

const config: ConfigurationFile = {
  title: 'angular.json',
  type: 'angular-config',
  description:
    'The configuration used for angular-cli v6, the new cli to run angular projects.',
  moreInfoUrl: 'https://github.com/angular/angular-cli/wiki/angular-cli',
  partialSupportDisclaimer: `Only \`project.build\` field is supported.`,

  getDefaultCode: () =>
    JSON.stringify(
      {
        version: 1,
        newProjectRoot: 'projects',

        projects: {
          codesandbox: {
            root: '',
            sourceRoot: 'src',
            projectType: 'application',
            prefix: 'app',
            schematics: {},
            architect: {
              build: {
                builder: '@angular-devkit/build-angular:browser',
                options: {
                  outputPath: 'dist/codesandbox',
                  index: 'src/index.html',
                  main: 'src/main.ts',
                  polyfills: 'src/polyfills.ts',
                  tsConfig: 'src/tsconfig.app.json',
                  assets: ['src/favicon.png', 'src/assets'],
                  styles: ['src/styles.css'],
                  scripts: [],
                },
                configurations: {
                  production: {
                    fileReplacements: [
                      {
                        replace: 'src/environments/environment.ts',
                        with: 'src/environments/environment.prod.ts',
                      },
                    ],
                    optimization: true,
                    outputHashing: 'all',
                    sourceMap: false,
                    extractCss: true,
                    namedChunks: false,
                    aot: true,
                    extractLicenses: true,
                    vendorChunk: false,
                    buildOptimizer: true,
                  },
                },
              },
              serve: {
                builder: '@angular-devkit/build-angular:dev-server',
                options: {
                  browserTarget: 'codesandbox:build',
                },
                configurations: {
                  production: {
                    browserTarget: 'codesandbox:build:production',
                  },
                },
              },
              'extract-i18n': {
                builder: '@angular-devkit/build-angular:extract-i18n',
                options: {
                  browserTarget: 'codesandbox:build',
                },
              },
              test: {
                builder: '@angular-devkit/build-angular:karma',
                options: {
                  main: 'src/test.ts',
                  polyfills: 'src/polyfills.ts',
                  tsConfig: 'src/tsconfig.spec.json',
                  karmaConfig: 'src/karma.conf.js',
                  styles: ['src/styles.css'],
                  scripts: [],
                  assets: ['src/favicon.png', 'src/assets'],
                },
              },
              lint: {
                builder: '@angular-devkit/build-angular:tslint',
                options: {
                  tsConfig: ['src/tsconfig.app.json', 'src/tsconfig.spec.json'],
                  exclude: ['**/node_modules/**'],
                },
              },
            },
          },
          'codesandbox-e2e': {
            root: 'e2e/',
            projectType: 'application',
            architect: {
              e2e: {
                builder: '@angular-devkit/build-angular:protractor',
                options: {
                  protractorConfig: 'e2e/protractor.conf.js',
                  devServerTarget: 'codesandbox:serve',
                },
                configurations: {
                  production: {
                    devServerTarget: 'codesandbox:serve:production',
                  },
                },
              },
              lint: {
                builder: '@angular-devkit/build-angular:tslint',
                options: {
                  tsConfig: 'e2e/tsconfig.e2e.json',
                  exclude: ['**/node_modules/**'],
                },
              },
            },
          },
        },
        defaultProject: 'codesandbox',
      },
      null,
      2
    ),

  schema:
    'https://raw.githubusercontent.com/angular/angular-cli/master/packages/angular/cli/lib/config/schema.json',
};

export default config;
