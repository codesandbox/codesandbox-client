## Feature comparison

This plugin is similar to [vscode-lit-html](https://github.com/mjbvz/vscode-lit-html) on many points. The power of `vscode-lit-html` is that it covers all the basic functionality of HTML in tagged templates, so it's a plugin that can be easily used with other libraries than `lit-html`. However `vscode-lit-plugin` (this one) aims to be a specialized plugin for working with `lit-element / lit-html`, so for example it supports `css` and discovers web components out of the box. 

Below is a comparison table of the two plugins:

| Feature                 | [vscode-lit-html](https://github.com/mjbvz/vscode-lit-html)   | [vscode-lit-plugin](https://github.com/runem/vscode-lit-plugin) |
|-------------------------|------------|------------|
| CSS support             | ❌         | ✅         |
| Goto definition         | ❌         | ✅         |
| Check missing imports   | ❌         | ✅         |
| Auto discover web components | ❌    | ✅         |
| Template type checking  | ❌         | ✅         |
| Report unknown tag names | ❌        | ✅         |
| Report unknown attrs    | ❌         | ✅         |
| Report unknown props    | ❌         | ✅         |
| Report unknown events   | ❌         | ✅         |
| Report unknown slots    | ❌         | ✅         |
| Support for vscode custom data format | ❌| ✅    |
| Refactor tag names      | ❌         | ✅         |
| Refactor attr names     | ❌         | ❌         |
| Auto close tags         | ✅         | ✅         |
| Syntax Highlighting     | ✅         | ✅         |
| Completions             | ✅         | ✅         |
| Quick info on hover     | ✅         | ✅         |
| Code folding            | ✅         | ⚠️ (disabled until problem with calling 'program.getSourceFile' is fixed) |
| Formatting              | ✅         | ⚠️ (disabled until problem with nested templates is fixed) |