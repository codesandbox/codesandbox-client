# Jest TestRunner

Huge thanks to Unibeautify for their initial work on this. Most of the code in `/testRunner` is utilizing their work, barring some changes to configuration.

For reference, see:
https://github.com/Unibeautify/vscode/tree/master/test

## Notes

### .vscodeignore

The test runner itself must be compiled for VSCode to run it, so it lives in `src` and gets compiled to js. However, it's not included in the final build via the [.vscodeignore](https://code.visualstudio.com/api/working-with-extensions/publishing-extension#.vscodeignore) file.

### ts-jest

The tests themselves don't need to be compiled due to `ts-jest`, so they're ignored in the `tsconfig.json`

### jest-config.ts

This is a standard Jest configuration object which is passed to the CLI. For a full reference, see [Jest Config](https://jestjs.io/docs/en/configuration.html). A couple noteworthy configuration options that are used:

- `testEnvironment`: This points to the custom test environment that's provided in order to run vscode. The environment extends `NodeEnvironment`, however it also adds `vscode` to the `global` object.
- `setupFilesAfterEnv`: Script to run for any initialization before tests are run. This mocks requests for the vscode module with the vscode object we've provided on the `global` object in the custom test environment.
