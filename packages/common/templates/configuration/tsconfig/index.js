// @flow
import type { ConfigurationFile } from '../types';

const JSX_PRAGMA = {
  react: 'React.createElement',
  preact: 'h',
};

const config: ConfigurationFile = {
  title: 'tsconfig.json',
  type: 'typescript',
  description: 'Configuration for how TypeScript transpiles.',
  moreInfoUrl: 'http://www.typescriptlang.org/docs/handbook/tsconfig-json.html',

  getDefaultCode: (
    template: string,
    resolveModule: (path: string) => ?{ code: string }
  ) => {
    if (template === 'create-react-app-typescript') {
      return JSON.stringify(
        {
          compilerOptions: {
            outDir: 'build/dist',
            module: 'esnext',
            target: 'es5',
            lib: ['es6', 'dom'],
            sourceMap: true,
            allowJs: true,
            jsx: 'react',
            moduleResolution: 'node',
            rootDir: 'src',
            forceConsistentCasingInFileNames: true,
            noImplicitReturns: true,
            noImplicitThis: true,
            noImplicitAny: true,
            strictNullChecks: true,
            suppressImplicitAnyIndexErrors: true,
            noUnusedLocals: true,
          },
          exclude: [
            'node_modules',
            'build',
            'scripts',
            'acceptance-tests',
            'webpack',
            'jest',
            'src/setupTests.ts',
          ],
        },
        null,
        2
      );
    }

    if (template === 'parcel') {
      const tsconfig = {
        compilerOptions: {
          module: 'commonjs',
          jsx: 'preserve',
          jsxFactory: undefined,
          esModuleInterop: true,
          sourceMap: true,
          allowJs: true,
          lib: ['es6', 'dom'],
          rootDir: 'src',
          moduleResolution: 'node',
        },
      };

      const packageJSONModule = resolveModule('/package.json');

      if (packageJSONModule) {
        try {
          const parsed = JSON.parse(packageJSONModule.code);

          let pragma = null;
          Object.keys(JSX_PRAGMA).forEach(dep => {
            if (
              (parsed.dependencies && parsed.dependencies[dep]) ||
              (parsed.devDependencies && parsed.devDependencies[dep])
            ) {
              pragma = JSX_PRAGMA[dep];
            }
          });

          if (pragma !== null) {
            tsconfig.compilerOptions.jsx = 'react';
            tsconfig.compilerOptions.jsxFactory = pragma;
          }
        } catch (e) {
          /* do nothing */
        }
      }
      return JSON.stringify(tsconfig, null, 2);
    }

    if (template === 'nest') {
      return JSON.stringify(
        {
          compilerOptions: {
            module: 'commonjs',
            declaration: true,
            noImplicitAny: false,
            removeComments: true,
            noLib: false,
            allowSyntheticDefaultImports: true,
            emitDecoratorMetadata: true,
            experimentalDecorators: true,
            target: 'es6',
            sourceMap: true,
            outDir: './dist',
            baseUrl: './src',
          },
        },
        null,
        2
      );
    }

    return JSON.stringify(
      {
        compilerOptions: {
          outDir: 'build/dist',
          module: 'esnext',
          target: 'es5',
          lib: ['es6', 'dom'],
          sourceMap: true,
          allowJs: true,
          jsx: 'react',
          moduleResolution: 'node',
          rootDir: 'src',
          forceConsistentCasingInFileNames: true,
          noImplicitReturns: true,
          noImplicitThis: true,
          noImplicitAny: true,
          strictNullChecks: true,
          suppressImplicitAnyIndexErrors: true,
          noUnusedLocals: true,
        },
      },
      null,
      2
    );
  },

  schema:
    'https://raw.githubusercontent.com/SchemaStore/schemastore/master/src/schemas/json/tsconfig.json',

  partialSupportDisclaimer: `Only \`compilerOptions\` field is supported.`,
};

export default config;
