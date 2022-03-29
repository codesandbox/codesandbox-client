## How to update `main.min.json`

### Definition
It's a JSON file that includes the extensions from VS Code, and it has reimplemented many parts of nodes to make those extensions work. 

In order to avoid thousands of requests on the client, to load all extensions files, this file minifies all extensions in a single file; in other words, this file is part of the optimizations to make these extensions work fast.

### How to generate this file:
1. Load the client in development mode;
2. Delete the original file (main.min.json);
3. Load the editor and wait for a few until it loads all dependencies; it might take a few seconds or even a minute;
4. Go to the browser console and type the following command to copy all extensions: `copy(JSON.stringify(global.fileReads))`
5. Clone this repository https://github.com/codesandbox/extension-bundle-utils
6. Paste the extension content into `src/input/main.json`
7. Run `yarn start` to minify the file;
8. Copy `src/input/main.min.json` and it's ready to paste the original file.

## Update vs-extensions cache
You must update the version of the following files:
- packages/app/config/build.js:6 & 10
- packages/app/config/webpack.prod.js:187
- packages/app/scripts/copy-assets.js:25
- packages/app/src/app/index.html:79 & 80 & 82
- packages/app/src/app/overmind/effects/vscode/constants.ts:3
- packages/app/src/app/overmind/effects/vscode/metadata.ts:4
- standalone-packages/vscode-editor/release/min/vs/editor/codesandbox.editor.main.js:public/vscode-extensions/v[:version-number]