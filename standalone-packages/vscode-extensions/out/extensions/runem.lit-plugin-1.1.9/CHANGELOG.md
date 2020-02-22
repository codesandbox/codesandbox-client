# Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)

<!-- ### Added -->
<!-- ### Changed -->
<!-- ### Removed -->
<!-- ### Fixed -->

## [1.1.9] - 2019-10-17

### Added
- New rule `no-unintended-mixed-binding` to prevent bugs like `<input value=${"foo"}} />` ([#44](https://github.com/runem/lit-analyzer/issues/44))
- Hex colors within html/css templates are now highlighted in the vscode plugin ([#30](https://github.com/runem/lit-analyzer/issues/30))

### Fixed
- Big internal refactor, including adding a lot of tests ([#49](https://github.com/runem/lit-analyzer/pull/49))
- Fixed problem where closing tags weren't auto-completed properly ([#37cba351](https://github.com/runem/lit-analyzer/commit/37cba3519762a1b8c6f6522baa40842e1b5ac504))
- Fixed problem where lit-analyzer would crash when running with a newer version of Typescript ([#58](https://github.com/runem/lit-analyzer/issues/58))


## [1.1.8] - 2019-08-13

### Added
- Export Bazel plugin ([#39](https://github.com/runem/lit-analyzer/issues/39))
- Support css snippets and % units ([#40](https://github.com/runem/lit-analyzer/issues/40))

### Fixed
- Fix problem where the value of attributes on the form attr='val' could get parsed incorrectly. ([#36](https://github.com/runem/lit-analyzer/issues/36))

## [1.1.4] - 2019-08-05

### Added
- Some rules are disabled as default to give users a smoother on-boarding experience. To re-enable the stricter rules please set "strict: true". Consult the documentation for more information.
- Functionality has been refactored into "rules" which can be enabled and disabled individually. It should now be much clearer how to enabled or disable individual functionality. Consult the documentation for more information.

- When using the @property decorator from "lit-element" the type of "{type: ...}" is checked against the actual property type.
- Support for using components built with mixins
- Warning when using boolean type expression in attribute binding ([#15](https://github.com/runem/lit-analyzer/issues/15))
- Allow "null" and "undefined" as values always when using "?" attr binding ([#16](https://github.com/runem/lit-analyzer/issues/16))
- Suggested code fix: Please use the `ifDefined` directive. ([#17](https://github.com/runem/lit-analyzer/issues/17))
- The usage of built-in directives is now checked to make sure that they are used correctly.
- Experimental: It's now possible to refactor custom element tag names.

- The analyzer has been updated and should now be much more robust (see [web-component-analyzer](https://github.com/runem/web-component-analyzer)).
- The type checker has been updated and should now be much more robust (see [ts-simple-type](https://github.com/runem/ts-simple-type)).

## [1.0.0] - 2019-04-01

### Added

- Added support for `observedAttributes`, `properties` and `jsdoc comments` as well as web component libraries built with stencil.
- Autocompletion and type checking for properties. Properties on built in elements are supported.
- Autocompletion and name checking for **slots**. Add slots to your component using `@slot myslot` jsdoc.
- Autocompletion and name checking for **events**. `new CustomEvent("myevent")` in the component is found automatically or you can choose to add events to your component using `@fires myevent` jsdoc.
- Added check for using the property modifier without an expression as this is not support by lit-html to catch errors like `.myProp="hello"`.
- Added support for code folding
- Added support for vscode custom html data format.
- Support for declaring attributes and properties using `@attr myattr` and `@prop myprop` jsdoc.
- CSS autocompletion now includes all custom element tag names available.

### Fixed

- The web component analyzer is now much more stable and won't crash on strange inputs.

### Removed

- Temporarily disabled code formatting until issues with nested templates are solved.

## [0.1.0] - 2019-02-22

### Added

- Added code completions and diagnostics for the `CSS` tagged template and`<style>` tag.
- Added check for non-callable types given to event listeners in order to catch errors like `@click="myHandler()"`.
- More reliable type checking across all assignments.
- Better support for built in tag names and global attributes. These now directly use data from the vscode html language service.
- Values are now auto completed for attribute assignments where possible. For example an attribute with a string union type `"large" | "small"` will suggest these values.
- Inline documentation is now shown when listing completions.

### Fixed

- Fixed issue where components from libraries would be imported as `import "../../node_modules/my-component"` and not `import "my-component"`
- Added various missing global built in elements.
- Added various missing global built in attributes like 'aria-\*' attributes.

## [0.0.24] - 2019-02-08

### Added

- Added support for `@ts-ignore` comments ([#2](https://github.com/runem/lit-analyzer/pull/2))
- Added reformat support
- Added support for libraries that extend the global `HTMLElementTagNameMap`

### Fixed

- Fixed broken auto-close tag functionality
