---
banner: ./3-6-7.jpg
title: v3.6.7
slug: bug fixes v3.6.7
date: 2020-06-18
description: This release includes bug fixes.
---

###

#### Features

1. We now allow markdown in sandbox descriptions

#### Fixes

- We changed how we handle browser authentication to make it more reliable
- Fixed edge-cases in Live for those with flaky connections
- Resolved an issue with changing files after forking
- Fixed an issue with the upload icon not showing in private sandboxes
- Made further fixes for handling edge-cases in ES Modules
- [@tehnuge](https://github.com/codesandbox/codesandbox-client/pull/4349) fixed
  icon padding in the deployment modal
- [@layershifter](https://github.com/codesandbox/codesandbox-client/pull/4337)
  made exports mutable
