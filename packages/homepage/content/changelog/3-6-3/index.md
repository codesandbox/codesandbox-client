---
banner: ./images/3-6-3.jpg
title: v3.6.3
slug: bug fixes v3.6.3
date: 2020-04-23
description: This release includes bug fixes.
---

###

#### Features

1. You can now invite team members via email or by sharing a link
2. Usernames now autocomplete when inviting team members
3. Added a config option to specify a custom start script in container sandboxes
4. [@jyash97](https://github.com/codesandbox/codesandbox-client/pull/3936) added
   a copy link to templates in the context menu on the dashboard
5. Updated the styling of the preferences menu to match design changes in the
   editor
6. We now link to example sandboxes that use a dependency from the list of
   dependencies in the editor

#### Fixes

- Updated the privacy policy to more clearly explain what data we store and why
- The UI for editing Prettier and Sandbox config files now works properly again
- Made TypeScript error language consistent with errors shown elsewhere in the
  editor
- [@tanmoyopenroot](https://github.com/codesandbox/codesandbox-client/pull/3881)
  fixed refreshing of hash-based URLs in the preview window
