---
title: 'Environment'
authors: ['Saeris']
description: 'CodeSandbox uses different execution environments based on the contents of a sandbox.'
---

## What is an Environment?

When using CodeSandbox, your code is evaluated and run by one of our built-in execution environments. These execution environments come in one of two types: Client and Container.

Client environments run entirely inside of your browser and will continue to bundle your code even when you lose your connection to our servers. Containers on the other hand are executed server-side inside of a Docker container instance.

While Client Sandboxes have faster previews and offline availability, they lack in configurability. Container Sandboxes take longer to start up, but effectively behave much like a local development environment, allowing you to customize your build tools, set up servers to listen to incoming requests, etc.

Below is a list of each of our environments.

## Client Environments

Client Sandboxes each have their own bundler attached to them which are configured to support a specific framework and emulate their official CLI tools. They are not one-to-one implementations and thus cannot be configured within CodeSandbox, however they are designed to mirror the default behavior of the framework. If your project requires advanced configuration, try using a Container Sandbox instead.

Currently it is not possible to convert a Client Sandbox to a Container Sandbox. This is on the near roadmap, you can follow progress [here](https://github.com/codesandbox/codesandbox-client/issues/2111).

### Angular Bundler

> Based on Angular CLI

### CXJS Bundler

> Based on CXJS

### Dojo Bundler

> Based on @dojo/cli-create-app

### Preact Bundler

> Based on Preact CLI

### React Bundler

> Based on Create React App

### Reason Bundler

>

### Static

The Static environment actually has no file processing to it at all! It merely serves the included `index.html` and any linked assets.

### Svelte Bundler

### Vanilla Bundler

The Vanilla environment uses Parcel to compile and serve a JavaScript application bundle.

### Vue Bundler

> Based on Vue CLI

## Container Environment

### Node
