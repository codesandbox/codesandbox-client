# Adding a Template

This doc will describe all the resource you might need to add a new template to CodeSandbox. We will list all the contributions that are needed to add a new template, and will give some examples.

It might sound like a lot of work to add a new template, it's currently not the easiest process. That's why we created the docs, we're working on a system that will make it easier to create new templates.

## What are templates?

Templates are nothing more than an identifier for a sandbox. We use this identifier to improve the UX in the editor and the preview. For example, for the `vue-cli` template we change the default `eslint` rules and what can be configured in a sandbox. We encourage every template creator to take an effort to improve the editor experience for their template, that will give the best experience for everyone using your template.

## Types of Templates

Before working on a template it's important to know the difference between Containers and Sandboxes. We currently support two kind of projects, with vastly different functionalities.

### Sandboxes

CodeSandbox has always executed projects in the browser. This means that we do transpiling, bundling, dependency resolvement and more all in the browser. There is no server involved. This has some advantages over conventional approaches; it works offline, is more snappy and doesn't give us server costs (which means that we can have as many sandboxes as we want without worrying (a lot ;-)).

There are also some disadvantages to running the sandboxes in a browser. The main one is that we lose flexibility: it's not possible to run CLI commands and in some cases we don't support custom configuration (like a custom webpack configuration). That's why we developed a new kind of sandbox called Container in September.

### Containers

We, unlike sandboxes, execute Container sandboxes on a server. We can run more end-to-end projects with container sandboxes, like `Next.js`. We allow you to run any command on a container, everything that works locally works in a container. Containers are also used to build bigger projects.

There are some limitations to this approach though: we only allow signed in users to work on a container and the amount of container sandboxes a user can have is limited (this limit changes as we make containers more stable). You also can't edit containers while offline and it's not possible to edit containers when viewing from an embed.

### Which one to choose?

The template defines whether a sandbox is executed in a container or in the browser. This means that it's your choice where to execute the sandbox.

It fully depends on what you aim to demo. If you aim to demo some CLI functionality we recommend you to create a container, if you're aiming to demo a JavaScript framework (like `create-react-app`) it's recommended to use a sandbox.

We encourage everyone to first evaluate whether the template works as a "sandbox".

## Implementing the Template

There are already some example PRs that add new templates, these are a great resource to check out:

- [CxJS](https://github.com/CompuIves/codesandbox-client/pull/683)
- [Dojo](https://github.com/CompuIves/codesandbox-client/pull/665)

There are several places that need to be updated to support a new template. This is a list of steps that need to be done for a new template:

### App

- [ ] Add the logo of the template [here](https://github.com/CompuIves/codesandbox-client/tree/master/packages/common/components/logos).
- [ ] Add the template definition [here](https://github.com/nicknisi/codesandbox-client/blob/f5b88bdb2faa3c2c85b7a1aa94606883c0473067/packages/common/templates/)
  - [This](https://github.com/nicknisi/codesandbox-client/blob/f5b88bdb2faa3c2c85b7a1aa94606883c0473067/packages/common/templates/preact.js) is a good reference
  - All options are described [here](https://github.com/nicknisi/codesandbox-client/blob/f5b88bdb2faa3c2c85b7a1aa94606883c0473067/packages/common/templates/template.js)
- [ ] Then add your template to the list [here](https://github.com/CompuIves/codesandbox-client/blob/master/packages/common/templates/index.js). This will allow us to retrieve the template.

### Sandbox (container sandboxes can skip this)

For the sandboxes that run in the browser we need to define what transpilers need to be run.

We call a template configuration for the bundler in CodeSandbox a 'Preset'. All currently installed presets are defined [here](https://github.com/CompuIves/codesandbox-client/blob/master/packages/app/src/sandbox/eval/index.js). I recommend everyone to take a look at some templates to grasp how the configuration works. [This](https://github.com/CompuIves/codesandbox-client/blob/master/packages/app/src/sandbox/eval/presets/create-react-app-typescript/index.js) is one of the simplest presets.

For a template to work in the bundler it needs to have a preset in the sandbox.

### Sandbox Importer

We allow people to import sandboxes from GitHub/CLI/API, to make sure that the right template is imported we have some specific logic that determines a template for every template. This is not in the current repository, it's in our [importers repository](https://github.com/codesandbox-app/codesandbox-importers). Your template needs to be added to [this file](https://github.com/codesandbox-app/codesandbox-importers/blob/master/packages/import-utils/src/create-sandbox/templates.ts).

### Testing

To test the new template we need to mock the response from the API to force the new template specification. We can do this by uncommenting [this line](https://github.com/CompuIves/codesandbox-client/blob/master/packages/app/src/app/store/actions.js#L13) and changing "custom" to the id of your template:

```diff
    .then(data => {
-     // data.template = 'custom';
+     data.template = 'custom';
      const sandbox = data;
      return path.success({ sandbox });
    })
```

#### Container Sandboxes

It's currently not possible to test the preview functionality of container sandboxes, we recommend you to test if the sandbox works in a `node` template. If that's the case it will work for the new template as well.

### Conclusion and Tips

We recommend you to open 2 Pull Requests: one in the `codesandbox-client` repository and one in the `codesandbox-importers` repository for the import. We will make sure to merge and deploy the two PRs at the same time.

This is all that's needed to add a new template to CodeSandbox 🎉!
