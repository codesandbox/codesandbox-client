---
title: "Embedding"
authors: ["CompuIves"]
description: "It's possible to embed a sandbox on Medium and other websites."
---

## What is an Embed?

CodeSandbox has a separate application for the embed. This application is specifically built to be as small as possible. If you replace `s` in the URL of a sandbox to `embed` you have the embed version of the sandbox. Example: https://codesandbox.io/**s**/new => https://codesandbox.io/**embed**/new. Notice that the embed doesn't have all features of the full editor.

## Generate a URL

You can generate a URL clicking 'Share' in the header and selecting the options you want to have enabled.

![Share Button](./images/share-button.png)

## Embed on Medium

You can easily embed on Medium by taking your sandbox URL (like https://codesandbox.io/s/new) and pasting it in a Medium article. It should automatically become an embed after you press enter.

## Embed Options

The options shown in the embed modal are not all options available. We need a new UI for the share model to reflect these options, in the meantime you can find them here.

| Option           | Description                                                                   | Values                               | Default                              |
| ---------------- | ----------------------------------------------------------------------------- | ------------------------------------ | ------------------------------------ |
| `hidenavigation` | Hide the navigation bar of the preview.                                       | `0`/`1`                              | `0`                                  |
| `moduleview`     | Evaluate the file that is open in the editor.                                 | `0`/`1`                              | `0`                                  |
| `autoresize`     | Automatically resize the embed to the content (only works on Medium).         | `0`/`1`                              | `0`                                  |
| `codemirror`     | Use CodeMirror editor instead of Monaco (decreases embed size significantly). | `0`/`1`                              | `0`                                  |
| `eslint`         | Use eslint (increases embed size significantly).                              | `0`/`1`                              | `0`                                  |
| `forcerefresh`   | Force a full refresh of frame after every edit.                               | `0`/`1`                              | `0`                                  |
| `expanddevtools` | Start with the devtools (console) open.                                       | `0`/`1`                              | `0`                                  |
| `runonclick`     | Only load the preview when the user says so.                                  | `0`/`1`                              | `0`                                  |
| `view`           | Which view to open by default                                                 | `editor`/`split`/`preview`           | `split`, `preview` for small screens |
| `module`         | Which module to open by default                                               | path to module (starting with `/`)   | entry path                           |
| `initialpath`    | Which url to initially load in address bar                                    | string                               | `/`                                  |
| `fontsize`       | Font size of editor                                                           | number (in px)                       | `14`                                 |
| `highlights`     | Which lines to highlight (only works in CodeMirror)                           | comma separated list of line numbers |                                      |
| `editorsize`     | Size in percentage of editor.                                                 | number                               | `50`                                 |

## Example Embeds

These are some examples of embeds, based on their properties.

### Smallest Embed

This embed is focused on being as light as possible:

`https://codesandbox.io/embed/new?codemirror=1`

<iframe src="https://codesandbox.io/embed/new?codemirror=1" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

### Code Example Embed

You can also use CodeSandbox to show code examples, with highlighted lines. This is only supported with the CodeMirror editor currently:

`https://codesandbox.io/embed/new?codemirror=1&highlights=11,12,13,14`

<iframe src="https://codesandbox.io/embed/new?codemirror=1&highlights=11,12,13,14" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>
