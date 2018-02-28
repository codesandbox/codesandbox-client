// @flow
import type { ConfigurationFile } from '../types';

const config: ConfigurationFile = {
  title: 'tsconfig.json',
  type: 'typescript',
  description: 'Configuration for how TypeScript transpiles.',
  moreInfoUrl: 'http://www.typescriptlang.org/docs/handbook/tsconfig-json.html',

  getDefaultCode: (template: string) => {
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
