---
banner: ./4-0-0.png
title: v4.0.0
slug: team pro workspaces
date: 2021-02-03
description: Announcing Team Pro, the best way to use CodeSandbox with your team
---

### Announcing Team Pro

Team Pro is the best way to use CodeSandbox with your team. It's purpose-built
for product teams of all sizes to prototype rapidly, share knowledge, and get
better feedback so your whole team can build faster, together.

#### Features

1. Private NPM Packages - Use private npm packages from your own registry in
   sandboxes
2. Code Comments - Add feedback about a sandbox as a whole or on specific code
   lines
3. Preview Comments - Mark and comment on the preview itself. We snap a
   screenshot and note the browser version and screen size, too
4. Stricter Sandbox Permissions - Restrict collaborators from forking or
   downloading code in a shared sandbox

#### Fixes

- Resolved an issue which would sometimes redirect users to Template Universe
  away from the homepage
- [@jyash97](https://github.com/codesandbox/codesandbox-client/pull/5392) fixed
  an issue with redirection on clicking the close icon in the upgrade banner
- We enabled Babel 7 for CRA v4
- We fixed an Angular build error when project.architect is undefined
- Added support for the new React transform where you don't need to import React
- Updated the Mono Lisa font to the latest version resolving a Windows issue
  where 1 and I looked similar
- Added support for comments in tsconfig files
