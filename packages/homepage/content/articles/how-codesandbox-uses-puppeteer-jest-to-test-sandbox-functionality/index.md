---
banner: ./images/banner.png
slug: how-codesandbox-uses-puppeteer-jest-to-test-sandbox-functionality
authors: ['Ives van Hoorne']
photo: https://avatars0.githubusercontent.com/u/587016?s=460&v=4
title: How CodeSandbox uses Puppeteer & Jest to test sandbox functionality
description:
  CodeSandbox uses Puppeteer extensively, in this post we will explain how we
  use Jest & Puppeteer to test user written code.
date: 2018-02-22
---

Last year a tool called '[Puppeteer](https://github.com/GoogleChrome/puppeteer)'
was released by the [Chrome Developers](https://twitter.com/ChromiumDev) team.
This tool is a headless [Chrome](https://google.com/chrome), which means that
with it you can interact with and visit websites programmatically. This is a
powerful concept that has many uses.

[CodeSandbox](https://codesandbox.io) uses Puppeteer extensively nowadays. I
want to explain in 2 posts how we use Puppeteer. In this post I will explain why
and how we use Puppeteer for our test suite. In the next post I will cover how
we use Puppeteer and
[serverless](https://martinfowler.com/articles/serverless.html) functions to
generate previews and metadata for sandboxes (projects).

## But Why?

In CodeSandbox we do all bundling of the sandbox code in the browser,
[I've built a custom bundler](/post/creating-a-parallel-offline-extensible-browser-based-bundler-for-codesandbox)
to do this. We still make changes and add features to this bundler, so it's
crucial that we extensively test if the changes affect existing sandboxes built
by users.

#### Before

I've always kept a list of 'test' sandboxes and would load every sandbox
manually to see if they still worked. As you can probably expect, this proved to
be very time consuming as the list kept growing beyond 20 sandboxes and we
started getting more contributions. Puppeteer to the rescue!

#### Solution

Puppeteer has a really nifty function called
[`screenshot`](https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#pagescreenshotoptions)
(you can try it [here](https://try-puppeteer.appspot.com)). The function does
exactly what it describes: it takes a screenshot of the current webpage and
returns the `Buffer` of the screenshot. For CodeSandbox we can use this as a
snapshot tool: after every commit we take a screenshot of all test sandboxes and
compare them with the previously stored screenshots. If there's a difference of
more than 1% we fail the test suite.

## Implementation

I decided to use [Jest](https://github.com/facebook/jest) for running all tests.
We start by setting up an array of sandboxes to test:

```js
const SANDBOXES = [
  'new',
  'preact',
  'vue',
  'svelte',
  'react-ts',
  { id: 'github/reactjs/redux/tree/master/examples/todomvc', threshold: 0.04 },
  { id: 'jvlrl98xw3', threshold: 0.05 },
  // And moooore sandboxes
];
```

This is a list of sandbox ids, of which some have extra options like a more
tolerant threshold. We iterate this list to create test cases:

```js
const SANDBOXES = [];

describe('sandboxes', () => {
  SANDBOXES.forEach(sandbox => {
    const id = sandbox.id || sandbox;
    const threshold = sandbox.threshold || 0.01;

    it(
      `loads the sandbox with id '${id}'`,
      async () => {
        /* test code */
      },
      1000 * 120 * 1
    );
  });
});
```

The biggest question was how to take a screenshot of a single sandbox. This
turned out to be quite simple, we already support opening a sandbox as a
separate page by going to `https://:id.codesandbox.io` (example:
[https://vue.codesandbox.io](https://vue.codesandbox.io)). So the only thing
left for me was adding this functionality to the development server, so we can
create screenshots with the new code. I ended up changing our `webpack` config
to have a 'test' mode, this mode will only build the sandbox bundler and host it
at `http://localhost:3001#:id` (example: `http://localhost:3001#vue`). Note that
we set the id as a hash, this way we don't interfere with the routing of the
sandbox.

![A generated screenshot of a todo redux example](./images/0.png)

After having this set up it was fairly straightforward to build the rest.
There's already a library for comparing screenshots called
[`jest-image-snapshot`](https://github.com/americanexpress/jest-image-snapshot).
This library exposes `toMatchImageSnapshot` on `expect`, which works almost
exactly the same as `toMatchSnapshot`.

The final implementation looks like this:

```js
import puppeteer from 'puppeteer';

const SANDBOXES = [
  /* ids */
];

function pageLoaded(page) {
  return new Promise(async resolve => {
    // We expose a function which the bundler will call after evaluation
    await page.exposeFunction('__puppeteer__', () => {
      if (resolve) {
        resolve();
      }
    });
  });
}

describe('sandboxes', () => {
  let browser = puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  afterAll(() => {
    browser.close();
  });

  SANDBOXES.forEach(sandbox => {
    const id = sandbox.id || sandbox;
    const threshold = sandbox.threshold || 0.01;

    it(
      `loads the sandbox with id '${id}'`,
      async () => {
        browser = await browser;
        const page = await browser.newPage();
        const waitFunction = pageLoaded(page);
        // Go to the page
        page.goto('http://localhost:3001/#' + id, {
          timeout: 60000,
        });
        await waitFunction;
        // Let fetch requests finish before continuing...
        await page.waitFor(2000);

        const screenshot = await page.screenshot();

        // Check if the snapshot matches
        expect(screenshot).toMatchImageSnapshot({
          customDiffConfig: {
            threshold,
          },
          customSnapshotIdentifier: id.split('/').join('-'),
        });

        await page.close();
      },
      1000 * 120 * 1
    );
  });
});
```

You can see in the code that we expose a function called `window.__puppeteer__`.
The bundler calls `window.__puppeteer__` when it's finished, this function is
exposed by puppeteer so we can exactly know when we can take the screenshot. The
generated screenshots are then saved in the [GitHub](https://github.com) repo.
You can find them
[here](https://github.com/codesandbox/codesandbox-client/blob/master/packages/app/integration-tests/tests/__image_snapshots__/).

We run these tests using [CircleCI](https://circleci.com), but we need to
generate the initial screenshots locally. To ensure that we generate similar
screenshots as CircleCI we generate screenshots using a docker container. We
have a simple script which we just run to generate new screenshots:

```sh
#!/bin/bash
docker run --rm --name test-container -v $(pwd):/home/circleci/codesandbox-client -w /home/circleci/codesandbox-client -d -t codesandbox/node-puppeteer yarn start:test && \
sleep 6 && docker exec -it test-container yarn test:integrations && \
docker stop test-container
```

I have set up a simple workflow for CircleCI to start the test server and
simultaneously run the tests. These tests are run in a docker container that has
Puppeteer preinstalled.

![The workflow of CodeSandbox, notice the test-integrations step](./images/1.png)

We save all diffs as artifacts, so we can easily compare the screenshots. You
can see a list of artifacts of a recent test run
[here](https://circleci.com/gh/codesandbox/codesandbox-client/4291#artifacts/containers/0).

![A diff artifact: the arrows are different](./images/2.png)

## Conclusion

The implementation turned out to be quite simple, but it has saved me a lot of
time already. We now test a little over 20 sandboxes for every commit and PR. I
also noticed that I'm more inclined to add sandboxes to the test suite too,
which made the bundler more stable in general.

---

In the next post I will cover how we use Puppeteer with serverless functions to
generate metadata and oEmbed tags for sandboxes. You can follow my Twitter
[@CompuIves](https://twitter.com/CompuIves) or
[@codesandbox](https://twitter.com/codesandbox) to stay up to date!

If you're interested in the code; all code that was described here (and of
CodeSandbox) is open source on GitHub. You can find the main repository
[here](https://github.com/codesandbox/codesandbox-client).

I hope you found the post interesting, don't hesitate to respond with more ideas
and uses for Puppeteer!
