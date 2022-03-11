# astro-vscode

## 0.10.5

### Patch Changes

- bd0836d: - Added license
  - Package extension before publishing

## 0.10.4

### Patch Changes

- f48fa90: Fixed build command (again)

## 0.10.3

### Patch Changes

- 2debae9: Fixed build command

## 0.10.2

### Patch Changes

- 08269d1: Downgraded @types/vscode

## 0.10.1

### Patch Changes

- 72cf8b1: trigger release

## 0.10.0

### Minor Changes

- 7a21a36: Updated grammars and removed `astro-markdown` language

### Patch Changes

- 2f87d79: Added icon to language

## 0.9.3

### Patch Changes

- c4d43b4: Deploy to OpenVSX
- Updated dependencies [c4d43b4]
  - @astrojs/language-server@0.9.3

## 0.9.2

### Patch Changes

- 91404d1: Enable publishing to OpenVSX
- Updated dependencies [91404d1]
  - @astrojs/language-server@0.9.2

## 0.9.1

### Patch Changes

- 7dc85cc: Add support for Emmet inside components, upgrade Emmet version
- Updated dependencies [7dc85cc]
  - @astrojs/language-server@0.9.1

## 0.9.0

### Minor Changes

- 6b6b47a: Remove internal astro.d.ts files, instead prefer the one provided by Astro itself

### Patch Changes

- Updated dependencies [6b6b47a]
  - @astrojs/language-server@0.9.0
  - @astrojs/ts-plugin@0.2.0

## 0.8.10

### Patch Changes

- 8878324: Add feature to reload language server on ts/jsconfig change
- Updated dependencies [5b16fb4]
  - @astrojs/language-server@0.8.10

## 0.8.9

### Patch Changes

- Updated dependencies [d0485a2]
  - @astrojs/language-server@0.8.9

## 0.8.8

### Patch Changes

- Updated dependencies [526d5c7]
  - @astrojs/language-server@0.8.8

## 0.8.7

### Patch Changes

- Updated dependencies [897ab35]
  - @astrojs/language-server@0.8.7

## 0.8.6

### Patch Changes

- Updated dependencies [97559b6]
- Updated dependencies [4c93d24]
  - @astrojs/language-server@0.8.6

## 0.8.5

### Patch Changes

- f1f3091: Fix commenting, namespaced elements, and Fragment typings
- Updated dependencies [f1f3091]
  - @astrojs/language-server@0.8.5
  - @astrojs/ts-plugin@0.1.1

## 0.8.4

### Patch Changes

- Updated dependencies [481e009]
  - @astrojs/language-server@0.8.4

## 0.8.3

### Patch Changes

- cad5430: Fix plain script and style blocks
- Updated dependencies [fef3091]
  - @astrojs/language-server@0.8.3

## 0.8.2

### Patch Changes

- a408131: Several fixes for the syntax highlighter
- Updated dependencies [528c6bd]
  - @astrojs/language-server@0.8.2

## 0.8.1

### Patch Changes

- Updated dependencies [b20db6e]
  - @astrojs/language-server@0.8.1

## 0.8.0

### Minor Changes

- cf48420: Adds syntax highlighting support for Astro fenced codeblocks in all Markdown files

## 0.7.20

### Patch Changes

- 5034f23: Adds support for running as a [Web Extension](https://code.visualstudio.com/api/extension-guides/web-extensions)

## 0.7.19

### Patch Changes

- 2910b03: Add support for at-prefixed attributes
- Updated dependencies [2910b03]
  - @astrojs/language-server@0.7.19

## 0.7.18

### Patch Changes

- Updated dependencies [12b4ed3]
  - @astrojs/language-server@0.7.18

## 0.7.17

### Patch Changes

- Updated dependencies [7c6f6a6]
  - @astrojs/language-server@0.7.17

## 0.7.16

### Patch Changes

- Updated dependencies [b6f44d4]
- Updated dependencies [4166283]
  - @astrojs/language-server@0.7.16

## 0.7.15

### Patch Changes

- Updated dependencies [6340a79]
  - @astrojs/language-server@0.7.15

## 0.7.14

### Patch Changes

- Updated dependencies [e0facf6]
- Updated dependencies [3c903c3]
- Updated dependencies [b0a8bc1]
  - @astrojs/language-server@0.7.14

## 0.7.13

### Patch Changes

- Updated dependencies [1b2afc7]
  - @astrojs/language-server@0.7.13

## 0.7.12

### Patch Changes

- Updated dependencies [553969e]
- Updated dependencies [b4c1b70]
  - @astrojs/language-server@0.7.12

## 0.7.11

### Patch Changes

- Updated dependencies [02bcb91]
  - @astrojs/language-server@0.7.11

## 0.7.10

### Patch Changes

- Updated dependencies [1958d51]
- Updated dependencies [f558e54]
  - @astrojs/language-server@0.7.10

## 0.7.9

### Patch Changes

- Updated dependencies [6c952ae]
  - @astrojs/language-server@0.7.9

## 0.7.8

### Patch Changes

- Updated dependencies [f2f7fc8]
  - @astrojs/language-server@0.7.8

## 0.7.7

### Patch Changes

- Updated dependencies [6501757]
  - @astrojs/language-server@0.7.7

## 0.7.6

### Patch Changes

- Updated dependencies [ea2d56d]
  - @astrojs/language-server@0.7.6

## 0.7.4

### Patch Changes

- Updated dependencies [6604c9f]
  - @astrojs/language-server@0.7.4

## 0.7.3

### Patch Changes

- ae4a9e5: Provides special highlighting for component names
- Updated dependencies [8f7bd34]
  - @astrojs/language-server@0.7.3

## 0.7.2

### Patch Changes

- 1b3a832: Adds diagnostics (errors and warnings)
- Updated dependencies [1b3a832]
  - @astrojs/language-server@0.7.2

## 0.7.1

### Patch Changes

- Updated dependencies [7874c06]
  - @astrojs/language-server@0.7.1

## 0.7.1

### Patch Changes

- 25a7f22: Publishing new version

## 0.7.0

### Patch Changes

- Updated dependencies [72d3ff0]
  - @astrojs/language-server@0.7.0

## 0.6.1

- Makes the v0.6.0 features actually work 😅

## 0.6.0

- Fixes bug with signature help not appearing in the component script section.
- Adds completion suggestions for `Astro.*` APIs in the component script.
- Adds support for Hover based hints in the component script section.
- Fixes bug with Go to Definition (cmd + click) for Components.

## 0.5.0

- Bug fixes, dependency updates

## 0.4.3

### Patch Changes

- Improve support for <Markdown> component
- Bug fixes and improvements

## 0.4.2

### Patch Changes

- b3886c2: Added support for new <Markdown> component

## 0.4.1

### Patch Changes

- Updated VS Code Marketplace banner

## 0.4.0

### Minor Changes

- 06e2597: Adds support for import suggestions

### Patch Changes

- Updated dependencies [06e2597]
  - astro-languageserver@0.4.0
