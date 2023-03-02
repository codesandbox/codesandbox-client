---
banner: ./images/3-6-6.jpg
title: v3.6.6
slug: bug fixes v3.6.6
date: 2020-06-05
description: This release includes bug fixes.
---

###

#### Fixes

- We reduced the time it takes to run syntax highlighting by 3x in most cases
- Several fixes to resolve edge-cases in how the bundler handles ES modules
- We now better handle projects that define an invalid "modules" entry-point
- We also improved our handling of dynamic imports
- We fixed an overflow issue for long dependency names in the editor
- We removed the now superfluous notification that you're live since sandboxes
  are live by default
