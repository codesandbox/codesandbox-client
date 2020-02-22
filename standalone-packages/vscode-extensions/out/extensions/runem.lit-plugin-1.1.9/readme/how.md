
## How does this plugin work?

All features are provided by these three libraries:

-   **[ts-lit-plugin](https://github.com/runem/lit-analyzer)**: The typescript plugin that powers the logic through the typescript language service (code completion, type checking, eg.). Therefore issues regarding anything but syntax highlighting should be opened in `ts-lit-plugin` and not `vscode-lit-plugin`.
-   **[vscode-lit-html](https://github.com/mjbvz/vscode-lit-html)**: Provides highlighting for the html template tag.
-   **[vscode-styled-components](https://github.com/styled-components/vscode-styled-components)**: Provides highlighting for the css template tag.

This library couples it all together and synchronizes relevant settings between vscode and `ts-lit-plugin`.