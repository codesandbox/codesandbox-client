---
title: "Configuration"
authors: ["CompuIves"]
description: "You can configure sandboxes and other options with configuration files specified by the template."
---

## Configuration Files

We think that configuration is used when a program is too stupid to figure out what the user really wants, and try to steer away from it as much as possible. However, there are always advanced use cases where the user wants to control every aspect of their program, and thus configure everything. CodeSandbox is a clear example of a program that requires configuration, it doesn't fit the 95%.

That's why we introduce a concept called 'Configuration Files'. Every template on CodeSandbox has a list of configuration files it supports. You can see this list in the sidebar:

![Configurations File UI](./images/configuration.png)

## Configuration UI

Some configuration files can be configured using a UI. This UI will generate a configuration file based on its state.

## Sandbox Configuration

A sandbox can be configured too, you can do this with `sandbox.config.json`. We support these options:

| Option                   | Description                                                                                       | Possible Values | Default Value |
| ------------------------ | ------------------------------------------------------------------------------------------------- | --------------- | ------------- |
| `infiniteLoopProtection` | Whether we should throw an error if we detect an infinite loop                                    | `true`/`false`  | `true`        |
| `hardReloadOnChange`     | Whether we should refresh the sandbox page on every change, good for sandboxes with global state. | `true`/`false`  | `false`       |
