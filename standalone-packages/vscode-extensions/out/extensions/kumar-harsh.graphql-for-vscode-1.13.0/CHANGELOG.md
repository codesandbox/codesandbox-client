# [1.13.0](https://github.com/kumarharsh/graphql-for-vscode/compare/v1.12.1...v1.13.0) (2018-12-24)


### Bug Fixes

* **status-bar:** fix colours for different states ([525985d](https://github.com/kumarharsh/graphql-for-vscode/commit/525985d))
* **release:** fix release config ([a59253c](https://github.com/kumarharsh/graphql-for-vscode/commit/a59253c))
* **syntax:** highlight directives on interfaces. Closes [#112](https://github.com/kumarharsh/graphql-for-vscode/issues/112) ([df16a1c](https://github.com/kumarharsh/graphql-for-vscode/commit/df16a1c))
* **status-bar:** show status-bar item for more languages ([d11c6da](https://github.com/kumarharsh/graphql-for-vscode/commit/d11c6da))
* **ux:** show statusbar item even when output panel is focussed ([94faecf](https://github.com/kumarharsh/graphql-for-vscode/commit/94faecf))
* **ux:** stop focussing output panel when clicking statusbar item ([c8b73f4](https://github.com/kumarharsh/graphql-for-vscode/commit/c8b73f4))


### Features

* **syntax:** add support for graphql_ppx in reason ([8d275f5](https://github.com/kumarharsh/graphql-for-vscode/commit/8d275f5))

<a name="1.12.1"></a>
## [1.12.1](https://github.com/kumarharsh/graphql-for-vscode/compare/v1.12.0...v1.12.1) (2018-07-29)


### Bug Fixes

* **syntax:** fix blockstring description syntax, add some sample files ([d836051](https://github.com/kumarharsh/graphql-for-vscode/commit/d836051))

<a name="1.12.0"></a>
# [1.12.0](https://github.com/kumarharsh/graphql-for-vscode/compare/v1.11.0...v1.12.0) (2018-06-07)


### Features

* **syntax:** add highlighting for markdown fenced codeblocks ([96904e5](https://github.com/kumarharsh/graphql-for-vscode/commit/96904e5))
* **syntax:** add support for reason ([26b6bd1](https://github.com/kumarharsh/graphql-for-vscode/commit/26b6bd1))

<a name="1.11.0"></a>
# [1.11.0](https://github.com/kumarharsh/graphql-for-vscode/compare/v1.10.3...v1.11.0) (2018-05-04)


### Features

* **syntax:** add support for auto-closing pairs & surrounding pairs ([6934c67](https://github.com/kumarharsh/graphql-for-vscode/commit/6934c67))

<a name="1.10.3"></a>
## [1.10.3](https://github.com/kumarharsh/graphql-for-vscode/compare/v1.10.2...v1.10.3) (2018-05-04)


### Bug Fixes

* **syntax:** highlight '&' for combining multiple interfaces ([1b32f23](https://github.com/kumarharsh/graphql-for-vscode/commit/1b32f23))

<a name="1.10.2"></a>
## [1.10.2](https://github.com/kumarharsh/graphql-for-vscode/compare/v1.10.1...v1.10.2) (2018-05-02)


### Bug Fixes

* **release:** fix changelogs generation on release ([fc6051f](https://github.com/kumarharsh/graphql-for-vscode/commit/fc6051f))

<hr>

### Notice
Due to some intermediate changes in the build process,
the changelogs from 1.10.1 till 1.0.1 are only hosted on the releases page of the github repo: [https://github.com/kumarharsh/graphql-for-vscode/releases](https://github.com/kumarharsh/graphql-for-vscode/releases).

### 1.0.0
### Improved syntax highlighting in injected grammars
Also, refactored code and bumped the version to 1.0.0

### 0.4.0
### Go to Definition, Autocomplete & Schema Validation!
To use the syntax highlighting in your JS projects, you'll need to change your file's syntax to Javascript React, because this [doesn't work with Javascript Babel right now](https://github.com/dzannotti/vscode-babel/issues/6).

### 0.3.0
### Graphql syntax highlighting within JS/JSX/TS/TSX
To use the syntax highlighting in your JS projects, you'll need to change your file's syntax to Javascript React, because this [doesn't work with Javascript Babel right now](https://github.com/dzannotti/vscode-babel/issues/6).

### Improved syntax highlighting
The previous syntax highlighing was a little flaky and rather complex to maintain. This one is based off the [atom plugin](https://github.com/gandm/language-graphql-lb) by @gandm, and works much better and handles some cases which were not done previously.

### 0.2.2
Fixed enum syntax highlighting

### 0.2.1
Fixed some syntax highlights

### 0.1.1
Released as 0.2.0 due to excitement. Will be careful.

### 0.1.0
Extension released.
