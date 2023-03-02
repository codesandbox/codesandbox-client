---
banner: ./images/3-6-1.jpg
title: v3.6.1
slug: bug fixes v3.6.1
date: 2020-04-01
description: This release includes bug fixes.
---

###

#### Features

1. Following of read-only users and seeing their cursors if you follow them
2. [@tanmoyopenroot](https://github.com/codesandbox/codesandbox-client/pull/3738)
   added a keyboard shortcut Ctrl + Backtick to toggle opening and closing the
   console
3. Thanks to
   [@jamime](https://github.com/codesandbox/codesandbox-client/pull/3730),
   sandboxes can now consume packages that use an npm alias

#### Fixes

- Fixed an alignment issue with the Share icon
- [@tanmoyopenroot](https://github.com/codesandbox/codesandbox-client/pull/3759)
  made the template icon popup close upon selecting the icon
- We now correctly reset live counters after a sandbox is changed
- Fixed up an issue impacting live throttling when editing a sandbox solo
- Selections are now more stable in live sessions
- Fixed React Refresh HMR for class components
- You can now fork a sandbox twice again
- Fixed creating private github repos from private sandboxes
- Improved stability of reconnects in CodeSandbox Live
