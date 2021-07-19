---
title: Importing Sandboxes
authors: ['CompuIves']
description:
  There are many ways to create a sandbox on CodeSandbox, either
  programmatically or with a UI.
---

## Create Wizard

The most popular way of creating a new sandbox is the Create Sandbox screen.

![Create Sandbox screen](./images/create-wizard.png)

The Create Sandbox screen shows you all of the public templates that are
currently available, including official templates and those created by the
community. These are automatically forked when you select them, so you can edit
and begin creating your own sandbox.

## Import from GitHub

You can import a GitHub repository in to CodeSandbox using our
[import wizard](https://codesandbox.io/s/github) and pasting the URL to your
GitHub repository. We support custom branches and subdirectories.

The imported repository will always stay up to date with your latest commits.
This means that any change to the GitHub repository will be reflected
immediately in the sandbox.

### Using GitHubBox.com

An easy way to import a repo to CodeSandbox via URL is with GitHubBox.com.
Append 'box' to your github.com URL in between 'hub' and '.com' and it will
redirect to CodeSandbox.

Here's an example:

Change the GitHub URL:
https://github.com/reduxjs/redux/tree/master/examples/todomvc.

To: https://githubbox.com/reduxjs/redux/tree/master/examples/todomvc.

The result is we take the last part of the url (everything after github.com) and
use it in our importer at codesandbox.io/s/github/, adding the repo to
CodeSandbox.

### Using a Browser Extension

We have browser extensions for
[Chrome](https://chrome.google.com/webstore/detail/open-in-codesandbox/hdidglkcgdolpoijdckmafdnddjoglia)
and [Firefox](https://addons.mozilla.org/en-GB/firefox/addon/codesandbox/),
which add an 'Open in CodeSandbox' button to GitHub repo pages. This makes it
easy to import existing projects from GitHub in to CodeSandbox.

### Setting inference

When importting, we infer sandbox settings based on several files in a
repository.

| Sandbox Setting | Inferred from                                                                                                                                         |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| Title           | `name` field in `package.json`                                                                                                                        |
| Description     | `description` field in `package.json`                                                                                                                 |
| Tags            | `keywords` field in `package.json`                                                                                                                    |
| Template        | Based on [this](https://github.com/codesandbox-app/codesandbox-importers/blob/master/packages/import-utils/src/create-sandbox/templates.ts#L63) logic |

If the correct template isn't automatically being used when importing, then you
may specify a `template` property in your `./sandbox.config.json` file to
override the detected template.

```json
{
  "template": "node"
}
```

## Import Local projects via CLI

You can import a local project in to CodeSandbox by using our
[CLI](https://github.com/codesandbox-app/codesandbox-importers/tree/master/packages/cli).

You can install our CLI by running `npm install -g codesandbox`. Then import a
project by running `codesandbox {directory}`.

### Example usage

```
$ npm install -g codesandbox
$ codesandbox ./
```

## Define API

We offer an API that allows you to programmatically create a sandbox. This is
useful for documentation, enabling you to generate a sandbox on the fly from
code examples. You can call the endpoint
`https://codesandbox.io/api/v1/sandboxes/define` both with a `GET` and with a
`POST` request.

### Supported Parameters

We currently support three extra parameters. The query accepts the same options
as the [embed options](https://codesandbox.io/docs/embedding/#embed-options).

| Query Parameter | Description                                                                           | Example Input               |
| --------------- | ------------------------------------------------------------------------------------- | --------------------------- |
| `parameters`    | Parameters used to define how the sandbox should be created.                          | Example below               |
| `query`         | The query that will be used in the redirect url.                                      | `view=preview&runonclick=1` |
| `embed`         | Whether we should redirect to the embed instead of the editor.                        | `1`                         |
| `json`          | Instead of redirecting we will send a JSON response with `{"sandbox_id": sandboxId}`. | `1`                         |

### How it works

The API only needs one argument: `files`. This argument contains the files that
will be in the sandbox, an example body would be:

```json
{
  "files": {
    "index.js": {
      "content": "console.log('hello!')",
      "isBinary": false
    },
    "package.json": {
      "content": {
        "dependencies": {}
      }
    }
  }
}
```

#### Binary Files

You can import binary files by setting `isBinary` to `true` and `content` as a
URL to the file hosted externally. For example:

```json
{
  "isBinary": true,
  "content": "https://..."
}
```

#### Folders

You can create folders by naming the file with a `/` in it's name, allowing to
structure your application how you want:

```json
{
  "files": {
    "src/index.js": {
      "content": "console.log('hello!')",
      "isBinary": false
    },
    "package.json": {
      "content": {
        "dependencies": {}
      }
    }
  }
}
```

This will create a file called `index.js` in your `src` folder.

#### Package.json

Every request **requires** a `package.json`. This file can either be a string or
an object. We determine all information of the sandbox from the files, like we
do with the GitHub import.

### GET Request

It's very hard to send the JSON parameters with a GET request, there is a chance
of unescaped characters and the URL hits its limit of ~2000 characters quickly.
That's why we first compress the files to a compressed `lz-string`. We offer a
utility function in the `codesandbox` dependency for this. The implementation
looks like this:

```js
import { getParameters } from 'codesandbox/lib/api/define';

const parameters = getParameters({
  files: {
    'index.js': {
      content: "console.log('hello')",
    },
    'package.json': {
      content: { dependencies: {} },
    },
  },
});

const url = `https://codesandbox.io/api/v1/sandboxes/define?parameters=${parameters}`;
```

#### Example Sandbox

https://codesandbox.io/s/6yznjvl7nw?editorsize=50&fontsize=14&hidenavigation=1&runonclick=1

### POST Form

You can do the exact same steps for a POST request, but instead of a URL you'd
show a form. With a POST request you can create bigger sandboxes.

#### Example Sandbox

https://codesandbox.io/s/qzlp7nw34q?editorsize=70&fontsize=14&hidenavigation=1&runonclick=1

### Define without render

If you want to define a new sandbox without getting it rendered, you can add
`?json=1` to the request. For instance
`https://codesandbox.io/api/v1/sandboxes/define?json=1`. Instead of the render,
the result will be json data providing you with the `sandbox_id` of the new
sandbox.

This is useful, for instance, if you need to create a new sandbox
programmatically, so you can then embed it on your site (See
[Embed documentation](/docs/embedding)).

Both `get` and `post` requests are supported.

### XHR Request

You can also create a sandbox using an XHR request, like using `fetch`. An
example sandbox of that is here:

https://codesandbox.io/s/9loovqj5oy?editorsize=70&fontsize=14&hidenavigation=1&runonclick=1

## Import Single Components

You can import a local component in to CodeSandbox by using our other
[CLI](https://github.com/codesandbox/codesandboxer/tree/master/packages/codesandboxer-fs).

You can install our CLI by running `npm install -g codesandboxer-fs`. Then you
can export a project by running `codesandboxer {filePath}`.

```
$ npm install -g codesandboxer-fs
$ codesandboxer docs/examples/my-single-component.js
```

This will print out the id of a sandbox that does nothing but render the
targeted component, along with a link to that sandbox. This will also bundle in
other local files used by the component to ensure render.

## Import Using Codesandboxer

[Codesandboxer](https://github.com/codesandbox/codesandboxer) imports a single
file from a git repository, along with supplemental files and dependencies.
Using this creates an easy way to upload an example instead of an entire git
repository. This enables you to easily share examples with others, or to link to
editable versions of examples from a documentation website. React-codesandboxer
is the main version, but there are also versions for VS Code, Atom, and
BitBucket.

### How it works

Below the surface, react-codesandboxer fetches the files it needs from GitHub or
BitBucket, using a single file that will be rendered as the 'example' as an
entry point, then uses the Define API to upload the necessary files into a new
`create-react-app` sandbox.

Check out the [codesandboxer docs](https://github.com/codesandbox/codesandboxer)
for information on how to implement it.

```jsx harmony
import React, { Component } from 'react';
import CodeSandboxer from 'react-codesandboxer';

export default () => (
  <CodeSandboxer
    examplePath="examples/file.js"
    gitInfo={{
      account: 'noviny',
      repository: 'react-codesandboxer',
      host: 'github',
    }}
  >
    {() => <button type="submit">Upload to CodeSandbox</button>}
  </CodeSandboxer>
);
```

## Import Using Remark-codesandbox

[Remark-codesandbox](https://github.com/kevin940726/remark-codesandbox) is a
remark plugin for creating sandboxes directly from code blocks in documentation.
Developed by CodeSandbox community member Kai Hao, it supports popular platforms
including MDX, Gatsby, Storybook Docs, docz etc. Learn more about it in their
[documentation](https://github.com/kevin940726/remark-codesandbox#remark-codesandbox).
