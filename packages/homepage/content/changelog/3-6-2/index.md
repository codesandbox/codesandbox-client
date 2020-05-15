---
banner: ./images/banner.jpeg
title: v3.6.2
slug: bug fixes v3.6.2
date: 2020-04-16
description: This release includes bug fixes.
---

###

#### Features

1. You can now highlight a selection of code when sharing a sandbox URL
2. We no longer show ads in the editor to anonymous users
3. [@jyash97](https://github.com/codesandbox/codesandbox-client/pull/3886) added
   a copy sandbox link option for sandboxes on the dashboard
4. We added a button when viewing previews fullscreen to protect folks from
  phishing attempts

#### Fixes

- We introduced a new way of loading dependencies reducing first-time install
  times by up to 60x and 4x when cached
- Lots of tweaks to Live making it handle edge-cases more reliably
- We made some performance improvements that make VSCode load faster
- VSCode user snippets and extension quick input commands work again
- We’ve updated the TypeScript version in the editor from 3.6 to 3.8
- Upgraded the type fetching service to handle more concurrent requests and type more
  dependencies
- We now display the correct loading state for buttons when forking
- Fixed running Jest tests with JSDOM
- Setting custom VSCode themes now works again
- We now show the reason why an import has failed rather than just the error
  code
- Fixed-up an error message when opening markdown files
- Fixed bundler issues resolving Sass imports and importing CSS from npm
  dependencies
- We now show the anonymous sandbox limit error if it’s reached when forking
  from the “Create New Sandbox” screen
- Fixed an issue which prevented changing modes in a live session
- [@MichaelDeBoey](https://github.com/codesandbox/codesandbox-client/pull/3888)
  and [@FWeinb](https://github.com/codesandbox/codesandbox-client/pull/3871)
  updated embed example code to allow more services
- We now show huge text files properly in the editor although they are
  read-only
- Handlebar files are now handled correctly
- Thanks to
  [@jyash97](https://github.com/codesandbox/codesandbox-client/pull/3836) we now
  hide delete buttons on the liked sandboxes page of user profiles
- We now support showing type definitions from dependencies that have git dependencies
