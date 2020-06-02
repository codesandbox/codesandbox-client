---
banner: ./3-6-5.jpg
title: v3.6.5
slug: bug fixes v3.6.5
date: 2020-06-01
description: This release includes bug fixes.
---

###

#### Features

1. Static sites no longer require a package.json file to import and run
2. The bundler now resolves ES modules by default for consistency with other
   bundlers
3. Added support for dynamic Webpack loaders
4. We now send environment variables to Vercel as secrets when deploying
5. Enabled xr-spatial-tracking support in the preview for WebXR projects
6. [@flickz](https://github.com/codesandbox/codesandbox-client/pull/4200) added
   allow-autoplay support to previews too
7. Added this changelog to a "What's new" section in the Create Sandbox screen

#### Fixes

- We improved bundler compile speed
- Fixed up an issue with signing in on mobile
- [@timothyis](https://github.com/codesandbox/codesandbox-client/pull/4156)
  fixed Vercel logo dimensions
- Updated touch icons for iOS on mobile
- Resolved an issue with viewing sandbox config files in embeds
- Fixed ES module conversion for cyclic dependencies
- [@jyash97](https://github.com/codesandbox/codesandbox-client/pull/4244) fixed
  an issue with file references in URLs
- Fixed some issues with saving live sandboxes
- Added support for tsconfig in Vue
- Binary files now correctly import in private sandboxes
