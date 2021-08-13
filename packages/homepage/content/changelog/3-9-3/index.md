---
banner: ./3-9-3.jpg
title: v3.9.3
slug: vue 3 new dep modal
date: 2020-09-25
description: Vue 3 support and a new add dependency modal
---

#### Features

1. We've added support for Vue 3. Including a new template with native Hot
   Module Reloading that uses Vetur for TypeScript IntelliSense, snippets,
   Emmet, and linting.
2. New Dependency Modal, which makes adding dependencies faster - with a quick
   input field, support for keyboard shortcuts and adding multiple dependencies
   at once.
3. Console improvements to load faster and better handle large updates.

#### Fixes

- Fixed permissions on personal sandboxes
- [@jyash97](https://github.com/codesandbox/codesandbox-client/pull/4889) fixed
  an alignment issues in the tests splitpane resizer
- Fixed showing personal account in the share sheet
- We now delay the refresh after registering a preview secret
- [@jyash97](https://github.com/codesandbox/codesandbox-client/pull/4860) added
  validation for empty folders
- Fixed static deployments in Vercel with V1 being deprecated
- Fixed loading of pre-bundled dependencies in some cases
