---
title: Jest Tests
authors: ['CompuIves']
description: CodeSandbox has a native integration with Jest for running tests.
---

## What is Jest

Jest is a zero configuration test runner that allows you easily write JavaScript
tests without setting anything up. More info on [Jest](https://jestjs.io/).

## How to use Jest in CodeSandbox Client Sandboxes

In [Client sandboxes](/docs/environment) you can run Jest tests by creating
files that end with `.test.js`, `.spec.js`, `.test.ts(x)` and `.spec.js(x)`. We
will automatically detect these test files and show the results in the Tests
tab.

Note: In [Container sandboxes](/docs/environment) you can still use Jest (or
whichever test framework you want), but we don't auto-detect these and you'd
need to set it up yourself as you would locally.

![Test Bottom](./images/jest-tests.png)

The left side of the test view is an overview of all test files. The right side
shows the details of a file when you select it. You can decide re-run tests
manually by clicking on the Play icon. We automatically watch for file changes,
but you can disable this by clicking on the 'Refresh' icon on the left side.

![Test Details](./images/jest-details.png)

## Test Failures

We show failed tests in two ways: in the test overview and in the code editor
itself.

A failed test looks like this in the Test View:

![Test Error](./images/jest-error-overview.png)

And will also show squiggles in the editor:

![Test Squiggles](./images/jest-squiggles.png?v2)

## Example

Here's a failing Jest test running in a sandbox:

<iframe src="https://codesandbox.io/embed/n9m2w9q8x0?view=preview" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr" sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"></iframe>
