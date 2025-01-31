# Contribute with a Template

To contribute with a CodeSandbox template, you need to complete multiple steps
and submit two Pull Requests. We have created this guide to help you do this.
Here you will find descriptions and explanations for what you need to do, along
with some examples that we have added as references.

We realise that the process of submitting a template is not straightforward and
we hope that this guide will help you along the way. We are working on a system
that will make it easier.

If you think that we missed something in this guide or believe we could explain
something better, please let us know by submitting an
[issue](https://github.com/codesandbox/codesandbox-client/issues/new/choose)
with your feedback.

## What is a template?

A template is an identifier for a specific type of sandbox project that you can
create on [codesandbox.io](https://codesandbox.io), like projects using
`Gatsby`, `React` or `Vue.js`.

When you create a template you can customise how the template behaves, in order
to improve the User Experience of your template in the CodeSandbox editor and
preview. Examples of this include configuring which file should be opened in the
editor by default when choosing a template, or changing the default `eslint`
rules in a template, like with `vue-cli`.

We encourage template creators to improve the editor experience for their
templates in order to give everyone the best possible experience when using
templates.

## Template types

Templates can be of different types: **Sandboxes** or **Containers**, and have
major differences in functionality. It's important to know these differences
before you start working on a new template.

### Sandboxes

CodeSandbox executes projects in the browser, which we call sandboxes. This
means that the transpiling, bundling, dependency resolvement and more happens in
the browser itself, without a server being involved. This has some advantages
over conventional approaches; it works offline, is more performant and doesn't
give us server costs, which means we can have many sandboxes without having to
worry (a lot ;-)).

There are also some disadvantages to this approach. When sandboxes run in the
browser, we lose flexibility. It's no longer possible to run Command Line
Interface (CLI) commands and in some cases custom configurations are not
supported, for example a custom webpack configuration. This is why we have
developed a new kind of sandbox called **Container**, which we released in
September 2018.

### Containers

Unlike sandboxes, **containers** are executed on a server. This makes it
possible to create projects that are end-to-end based, like `Next.js` with
CodeSandbox, and also makes it possible to build bigger projects. **Containers**
let you run any command, and everything that works locally will also work in
container.

However, like the sandboxes, **containers** also come with some limitations. In
order to work on a container, you need to be signed in as a user, you can't edit
containers while offline, it's not possible to edit them from an embed, and you
can only have a limited amount of container based projects.

### Which one to choose?

As you have read above, the template type determines whether a project is
executed in a _sandbox in a browser_ or in a _container on a server_. This means
that the template type you have to choose, depends on your specific use-case and
where you want your project to be executed.

If you would like to demonstrate CLI functionality, we recommend that you use a
**container** type template, and if you want to demonstrate a JavaScript
framework (like `React`) we recommended using a **sandbox** type template.

We encourage everyone to first evaluate whether the template works as a sandbox,
before deciding on using a container.

## Adding a new template

In order to add a new template, you need to go through a set of steps. Some of
these steps you have to do, others depend on the type of template you want to
add (**sandbox** vs. **container**).

To get started, you should first follow the steps in our contribution guidelines
in order to
[set up CodeSandbox locally](https://github.com/codesandbox/codesandbox-client/blob/main/CONTRIBUTING.md#setting-up-the-project-locally).

### 1. Add template logo

Add the logo for your template in the
[templates repo](https://github.com/codesandbox/codesandbox-client/tree/main/packages/template-icons/src)
(`codesandbox-templates/packages/template-icons/src`).

#### SVG logos

Create a `.tsx` file in the `/src` directory with the appropriate name and
content. If your template's name is "Banana", name your logo file "BananaIcon".

Examples:

- [Vue logo](https://github.com/codesandbox/codesandbox-client/tree/main/packages/template-icons/src/VueIcon.tsx)
- [React logo](https://github.com/codesandbox/codesandbox-client/tree/main/packages/template-icons/src/ReactIcon.tsx)

### 2. Add template definition

In order for CodeSandbox to recognise your template, you need to add a new
definition of it in the `codesandbox-client/packages/common/src/templates`
[directory](https://github.com/codesandbox/codesandbox-client/tree/main/packages/common/src/templates).
You do this by creating a new `.ts` file with the name of your template.

Examples:

- [Parcel](https://github.com/codesandbox/codesandbox-client/blob/main/packages/common/src/templates/parcel.ts)
- [Gatsby](https://github.com/codesandbox/codesandbox-client/blob/main/packages/common/src/templates/gatsby.ts)

The template definition can have various options, which you can find more
information about in
[template.ts](https://github.com/codesandbox/codesandbox-client/blob/main/packages/common/src/templates/template.ts).

We encourage you to improve the user experience of your templates by taking
advantage of the options you have available while writing your template
definition.

Examples:

- Which file the editor should open by default
- Default rules the template should use

<!-- TODO: Add more examples -->

After writing your template definition, you also need to add it to the
[index.js](https://github.com/codesandbox/codesandbox-client/blob/main/packages/common/src/templates/index.ts)
file in the same directory (`codesandbox-client/packages/common/src/templates`)
in order for CodeSandbox to be able to retrieve your template.

### 3. Define transpilers for sandbox

_If you are adding a template for a **container** sandbox, you can skip this
step and proceed to step 4._

For the sandboxes that run in the browser we need to define what transpilers
need to be run. A template will not work in the bundler if it does not have a
preset.

We call a template configuration for the bundler in CodeSandbox a 'Preset'. All
currently installed presets are defined in the
[index.ts](https://github.com/codesandbox/codesandbox-client/blob/main/packages/app/src/sandbox/eval/index.ts)
file under `codesandbox-client/packages/app/src/sandbox/eval/presets`.

In order to understand how this configuration works, we recommend you to take a
look at templates that have already been implemented and their presets.

Examples:

- [create-react-app-typescript](https://github.com/codesandbox/codesandbox-client/blob/main/packages/app/src/sandbox/eval/presets/create-react-app-typescript/index.js)
  (most basic one)
- [CxJS](https://github.com/codesandbox/codesandbox-client/blob/main/packages/app/src/sandbox/eval/presets/cxjs/index.js)
- [vue-cli](https://github.com/codesandbox/codesandbox-client/blob/main/packages/app/src/sandbox/eval/presets/vue-cli/index.js)

### 4. Add the importer

We allow people to import sandboxes from GitHub/CLI/API, and to make sure that
the right template is imported we have some specific logic that determines a
template for every template. This logic is **not** found in `codesanbox-client`.

This means you that you also have to add your template in another file in the
`codesandbox-importers` repository called
[templates.ts](https://github.com/codesandbox/codesandbox-importers/blob/main/packages/import-utils/src/create-sandbox/templates.ts).

When you create your Pull Request in `codesanbox-client`, you also need to
create a Pull Request in `codesandbox-importer` and reference it in your Pull
Request for `codesandbox-client`. Example:

- [Add VuePress](https://github.com/codesandbox/codesandbox-client/pull/1652) in
  [codesandbox-client](https://github.com/codesandbox/codesandbox-client)
- [Add VuePress support](https://github.com/codesandbox/codesandbox-importers/pull/30)
  in
  [codesandbox-importer](https://github.com/codesandbox/codesandbox-importers)

### 5. Test the template

You can test your new sandbox template, however you cannot preview the
functionality of templates using containers.

#### Sandbox template

To test your new template, you need to create a mock response from the API and
force the new template specification. To do this, you uncomment
[this line](https://github.com/codesandbox/codesandbox-client/blob/main/packages/app/src/app/store/actions.js#L17)
and change `'custom'` to the id/name of your template:

```diff
    .then(data => {
-     // data.template = 'custom';
+     data.template = 'templatename';
      const sandbox = data;
      return path.success({ sandbox });
    })
```

#### Container template

<!-- TODO: clearify what to do here -->
<!-- TODO: Improve description of step -->

It's currently not possible to test the preview functionality of container
sandboxes and we recommend you to test if the sandbox works in a `node`
template. If your template works using `node`, it will work with your new
template as well.

To do this, please add a `sandbox.config.json` file to the root folder of the
repository that you are using as the basis for your template, with the content
of:

```json
{
  "template": "node"
}
```

To test it, you use CodeSandbox to access the repository that will be used for
the template like so: `https://codesanbox.io/s/github/user/repo-name`, where
`user` is the user/organisation who owns the repository and `repo-name` is the
name of the repository to use for the template.

After your Pull Request to add a new template has been merged, you can delete
this `sandbox.json.config` file from your repository.

### 6. Add yourself as a contributor

This project follows the all-contributors specification. Contributions of any
kind are welcome! To add yourself to the table of contributors in the README.md
file, please use the automated script as part of your PR:

```
yarn add-contributor
```

Follow the prompt and commit .all-contributorsrc and README.md in the PR.

Thank you for taking the time to contribute! 👍

### Conclusion

If your testing went well, congratulations! You have now created a new template
for CodeSandbox!

We will make sure to merge and deploy the two Pull Requests you made to both
`codesanbox-client` and `codesandbox-importers` at the same time.
