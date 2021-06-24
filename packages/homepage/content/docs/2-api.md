---
title: API
authors: ['CompuIves']
description: Helping you create a sandbox with our API.
---

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

| Query Parameter | Description                                                                          | Example Input               |
| --------------- | ------------------------------------------------------------------------------------ | --------------------------- |
| `parameters`    | Parameters used to define how the sandbox should be created.                         | Example below               |
| `query`         | The query that will be used in the redirect url.                                     | `view=preview&runonclick=1` |
| `embed`         | Whether we should redirect to the embed instead of the editor.                       | `1`                         |
| `json`          | Instead of redirecting we will send a JSON reponse with `{"sandbox_id": sandboxId}`. | `1`                         |

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

You can create folders by naming the file with a `/` in the name, allowing you
to structure your application how you want:

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

<br>

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

## Setting inference

When importing, we infer sandbox settings based on several files in a
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
