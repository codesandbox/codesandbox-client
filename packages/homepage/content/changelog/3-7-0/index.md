---
banner: ./3-7-0.jpg
title: v3.7.0
slug: better github workflow
date: 2020-06-26
description: A Better GitHub Workflow.
---

### A Better GitHub Workflow

You've been able to import and export projects to and from GitHub on CodeSandbox
for a while, but the workflow was confusing. This update makes working with
GitHub repos more user-friendly.

#### Features

1. Refined the core GitHub flow - you can now start a PR while staying in the
   same sandbox
2. GitHub sandboxes are now visually distinct from regular sandboxes, with
   status indicators and instructions so next steps are clearer
3. Added new functionality to keep a sandbox in sync with a GitHub repo and
   resolve conflicts

#### Fixes

- Improved execution time of custom Babel presets and plugins, reducing
  transpilation time of Vue from 18 to 2 seconds
- Added caching to Vue project transpilation
- Fixed an issue that meant we'd refresh the preview instead of hot reload in
  some cases
- Squashed a regression with dynamic imports
- Fixed a UI issue where old and new sandbox names would overlap while changing
  the name
- Resolved a UI issue with templates not being shown correctly in Template
  Universe for some users
- [@sunnyssr](https://github.com/codesandbox/codesandbox-client/pull/4440) fixed
  a bug with showing the incorrect branch name
- [@jyash97 ](https://github.com/codesandbox/codesandbox-client/pull/4462) fixed
  an issue with invalid color codes that could cause a crash
- [@akash-joshi](https://github.com/codesandbox/codesandbox-client/pull/4278)
  resolved a styling bug on the recent page of the dashboard
