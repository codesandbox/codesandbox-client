---
title: CI
authors: ['Ives van Hoorne']
description:
  Here's what CodeSandbox CI is, how it will benefit you as a library
  maintainer, and how to set it up for your library.
---

## What is CodeSandbox CI?

CodeSandbox CI is a [GitHub app](https://github.com/apps/codesandbox) that you
can install in your repository. The app is responsible for building your
library. Whenever a Pull Request is opened it builds a version of the library
from that PR. This is published to our registry, so you can immediately test the
library in CodeSandbox or locally without publishing to nom or elsewhere.

## Why do I want this?

The goal of this app is to make it easier for you to test your library without
publishing to npm yet. Since CodeSandbox is already used for bug reports we
wanted to make it possible to also test the PR version of your library with the
existing bug reports.

## How does it work?

A typical workflow might look like this:

- Someone opens an issue for a bug with a sandbox reproducible
- Someone opens a fix PR mentioning the issue
- We build the library from the PR, fork the sandbox repro and install the new
  library in that sandbox. This way you will only have to open the generated
  sandbox to confirm that the fix works with no need to clone, install or test
  locally.

## How do I set this up?

For most libraries, the only thing you need to do is install this
[GitHub App](https://github.com/apps/codesandbox). In some cases you might need
to do some configuration, an example of this is for monorepos. You can configure
your library by creating a file called `ci.json` in a folder called
`.codesandbox` (`.codesandbox/ci.json`) in the root of your repo. An example PR
can be found [here](https://github.com/facebook/react/pull/17175).

## Configuration

You can configure how your projects build on CodeSandbox CI by creating a file
called `ci.json` in a folder called `.codesandbox` in the root of your
repository.

### Configuration Format

These are all the configuration options you can set. They are all optional.

```json
{
  // which script in package.json to run to install instead of `npm ci` or `yarn install`,
  // can be `false` if you want to skip this step
  "installCommand": "install",
  // which script in package.json to run to build,
  // can be `false` if you want to skip this step
  "buildCommand": "build",
  // if you have a monorepo, put the paths of the packages here. We'll infer the package names.
  // globs are supported
  "packages": ["packages/react", "packages/react-dom"],
  // if you don't publish from the package directory, specify per dependency
  // where the contents of the built dependency are. These files will be uploaded
  // to our registry
  "publishDirectory": {
    "react": "build/node_modules/react"
    "react-dom": "build/node_modules/react-dom"
  },
  // a list of sandboxes that you want generated for a PR, if this list
  // is not set we will default to `vanilla`. The built library will automatically
  // be installed in the fork of these sandboxes in the place of the library. So if
  // you have a sandbox with `lodash`, and you built `lodash` and `vue`, we will only
  // replace `lodash` with the built version.
  "sandboxes": ["vanilla", "new", "github/reduxjs/redux/tree/master/examples/todomvc"]
}
```

### Monorepo Example

Monorepos are quite common, here's an example configuration for a monorepo:

```json
{
  "packages": ["./", "packages/vue-template-compiler"]
}
```

This builds two libraries: `vue`, which is in the root of the repository, and
`vue-template-compiler`, which resides in the `packages` folder.

We handle auto linking of these dependencies, this means that we rewrite the
dependencies to the newly built versions of CodeSandbox CI. In this example,
`vue` uses `vue-template-compiler`, so we've updated `package.json` of `vue` to
point to our built `vue-template-compiler`.
