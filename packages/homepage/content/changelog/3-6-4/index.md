---
banner: ./images/3-6-4.jpg
title: v3.6.4
slug: bug fixes v3.6.4
date: 2020-05-14
description: This release includes bug fixes.
---

###

#### Features

1. Team names are now editable

#### Fixes

- We improved editor rendering performance
- We also improved performance when opening and closing files or directories,
  and switching between them
- We updated the design of the 404 page and sign-in modal
- [@arthurdenner](https://github.com/codesandbox/codesandbox-client/pull/4089)
  fixed up keyboard navigation when searching in Template Universe
- We no longer show the "More" button in Presence if there's just one more user
  to show
- [@arthurdenner](https://github.com/codesandbox/codesandbox-client/pull/4087)
  and [timothyis](https://github.com/codesandbox/codesandbox-client/pull/4116)
  helped replace references of Zeit to Vercel
- We now properly handle environment variables that contain quotes
