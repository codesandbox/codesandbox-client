---
title: Environment
authors: ['Saeris']
description:
  CodeSandbox uses different execution environments based on the contents of a
  sandbox.
---

## What is an Environment?

When using CodeSandbox, your code is evaluated and run by one of our built-in
execution environments. These execution environments come in one of two types:
Client and Container.

Client environments run entirely inside of your browser and will continue to
bundle your code even when you lose your connection to our servers. Containers
on the other hand are executed server-side inside of a Docker container
instance.

While Client Sandboxes have faster previews and offline availability, they don't
offer many configuration capabilities. Container Sandboxes take longer to start
up, but effectively behave much like a local development environment, allowing
you to customize your build tools, set up servers to listen to incoming
requests, etc.

## Client Environments

Client Sandboxes each have their own bundler attached to them which are
configured to support a specific framework and emulate their official CLI tools.
They are not one-to-one implementations and thus do not support advanced
configuration like custom webpack configurations or ejecting. However, they are
designed to mirror the default behavior of the framework. If your project
requires advanced configuration, try using a Container Sandbox instead.

Currently it is not possible to convert a Client Sandbox to a Container Sandbox.

## Container Environment

Container Sandboxes run by connecting to a Docker instance running on our
servers. We use the [official Node docker image](https://hub.docker.com/_/node)
in our container instances, meaning most Node packages should be supported out
of the box. With Containers, you can run your own bundlers such as Webpack and
retain full control over its configuration.

Containers also support running NPM scripts defined in your `package.json`. We
run a few of these scripts automatically to start up your server. See the list
below for which scripts we run automatically and what their priority is:

- `dev`
- `develop`
- `serve`
- `start`

While you can also lint your code using ESLint via the command line in
containers, we don't currently support custom ESLint configs in the editor
itself.

Unlike Client Sandboxes, Containers also expose access to the Terminal. This
allows you to run most commands you'd normally expect to be able to run in the
command line. However, you don't have root access. Also, keep in mind that
running certain commands which alter the filesystem of the container instance
will cause the files shown in the Editor to become out of sync, such as manually
running `yarn add` or running `git` commands. We don't sync files and
directories that are ignored via `.gitignore`, and there is a sync limit of 10
files per second and a maximum file size of 2mb.

## How can I tell if I am in a container sandbox?

When you are in a container sandbox, an environment variable called
`CODESANDBOX_SSE` will be available and you can always use it to check what your
current environment is.

https://codesandbox.io/s/codesandboxsse-example-spgyv
