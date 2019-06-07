# Apollo GraphQL for VS Code

GraphQL has the potential to create incredible developer experiences, thanks to its strongly typed schema and query language. The Apollo platform brings these possibilities to life by enhancing your editor with rich metadata from your graph API.

![demo](https://raw.githubusercontent.com/apollographql/apollo-tooling/master/packages/vscode-apollo/images/marketplace/jump-to-def.gif)

The Apollo GraphQL extension for VS Code brings an all-in-one tooling experience for developing apps with Apollo.

- Add [syntax highlighting](#syntax) for GraphQL files and gql templates inside JavaScript files
- Get instant feedback and [intelligent autocomplete](#autocomplete) for fields, arguments, types, and variables as you write queries
- Seamlessly manage your client-side schema alongside your remote one
- [See performance information](#performance-insights) inline with your query definitions
- Validate field and argument usage in operations
- [Navigate projects](#navigating-projects) easier with jump-to and peek-at definitions and more
- Manage [client-only](#client-only-schemas) schemas
- [Switch schema tags](#commands) to work on upcoming features

<h2 id="getting-started">Getting started</h2>

Some features of this extension (like syntax highlighting) will work without any configuration, but to get all of the benefits of the VS Code experience, it's best to link the schema that is being developed against **before** installing the extension. The best way to do that is by [publishing a schema](https://www.apollographql.com/docs/platform/schema-registry.html#setup) to the Apollo schema registry. Once that is done, two steps are needed:

1. Create an `apollo.config.js` at the root of the project
2. Copy an API key from the Engine dashboard of the published service

<h3 id="apollo-config">Setting up an Apollo config</h3>

In order for the VS Code plugin to know how to find the schema, it needs to be linked to either a published schema or a local one. To link a project to a published schema, edit the `apollo.config.js` file to look like this:

```js
module.exports = {
  client: {
    service: "my-graphql-app"
  }
};
```

The service name is the id of the service created in Engine and can be found in the services dashboard of [Engine](https://engine.apollographql.com)

> Important note: If the name of the service in Engine is changed, this value should be the service id. This can be found in the url when browsing the service in Engine.

<h3 id="api-key">Setting up an API key</h3>
To authenticate with Engine to pull down the schema, create a file next to the `apollo.config.js` called `.env`. This should be an untraced file (i.e. don't push it to GitHub). Go to the settings page of the published service and create a new API key.

> It is best practice to create a new API key for each member of the team and name the key so it's easy to find and revoke if needed

After the key is found, add the following line to the `.env` file:

```bash
ENGINE_API_KEY=<enter copied key here>
```

After this is done, VS Code should automatically update and start providing autocomplete, validation, and more!

<h3 id="local-schemas">Local schemas</h3>

Sometimes it may make sense to link the editor to a locally running version of a schema to try out new designs that are in active development. To do this, the `apollo.config.js` file can be linked to a local service definition:

```js
module.exports = {
  client: {
    service: {
      name: "my-graphql-app",
      url: "http://localhost:4000/graphql"
    }
  }
};
```

> Linking to the local schema won't provide all features such as switching schema tags and performance metrics.

More information about configuring an Apollo project can be found [here](https://www.apollographql.com/docs/references/apollo-config.html)

<h3 id="client-only-schemas">Client-only schemas</h3>

One of the best features of the VS Code extension is the automatic merging of remote schemas and local ones when using integrated state management with Apollo Client. This happens automatically whenever schema definitions are found within a client project. By default, the VS Code extension will look for all files under `./src` to find both the operations and schema definitions for building a complete schema for the application.

Client-side schema definitions can be spread throughout the client app project and will be merged together to create one single schema. If the default behavior isn't ideal, this can be controlled through the `apollo.config.js` at the root of the project:

```js
module.exports = {
  client: {
    service: "my-graphql-app"
    includes: ["./src/**/*.js"],
    excludes: ["**/__tests__/**"]
  }
}
```

<h3 id="get-the-extension">Get the extension</h3>

Once you have a config set up and a schema published, **install the Apollo GraphQL extension** by using this [link](https://marketplace.visualstudio.com/items?itemName=apollographql.vscode-apollo) or by searching `Apollo` in the VS Code extension marketplace. After installation, try opening a file containing a GraphQL operation.

When a file open, clicking the status bar icon will open the output window and print stats about the project associated with that file. This is helpful when confirming the project is setup properly.

<img src="https://raw.githubusercontent.com/apollographql/apollo-tooling/master/packages/vscode-apollo/images/marketplace/stats.gif"  alt="Clicking the status bar icon to open the output pane">

<h2 id="features">Features</h2>

Apollo for VS Code brings many helpful features for working on a GraphQL project.

<h3 id="autocomplete">Intelligent autocomplete</h3>

Once configured, VS Code has full knowledge of the schema clients are running operations against, including client-only schemas (for things like local state mutations). Because of this, it have the ability to autocomplete fields and arguments as you type.

<img src="https://raw.githubusercontent.com/apollographql/apollo-tooling/master/packages/vscode-apollo/images/marketplace/autocomplete.gif"  alt="vscode completing a field when typing">

<h3 id="errors-and-warnings">Inline errors and warnings</h3>

VS Code can use local or published schemas to validate operations before running them. **Syntax errors**, **invalid fields or arguments**, and even **deprecated fields** instantly appear as errors or warnings right in your editor, ensuring all developers are working with the most up-to-date production schemas.

<img src="https://raw.githubusercontent.com/apollographql/apollo-tooling/master/packages/vscode-apollo/images/marketplace/warnings-and-errors.gif"  alt="tooltip showing a field deprecation warning and error">

<h3 id="field-type-info">Inline field type information</h3>

Because of GraphQL's strongly-typed schema, VS Code not only know about which fields and arguments are valid, but also what types are expected. Hover over any type in a valid GraphQL operation to see what type that field returns and whether or not it can be null.

<img src="https://raw.githubusercontent.com/apollographql/apollo-tooling/master/packages/vscode-apollo/images/marketplace/type-info.png" style="max-width:800px;" alt="a tooltip showing a Boolean type for a field">

<h3 id="performance-insights">Performance insights</h3>

GraphQL's flexibility can make it difficult to predict the cost of an operation. Without insight into how expensive an operation is, developers can accidentally write queries that place strain on their graph API's underlying backends. Thanks to the Apollo platform's integration with VS Code and our trace warehouse, teams can avoid these performance issues altogether by instantly seeing the cost of a query right in their editor.

To turn on tracing for your GraphQL server, please visit our [guide](https://www.apollographql.com/docs/platform/setup-analytics.html).

The VS Code extension will show inline performance diagnostics when connected to a service with reported metrics in Engine. As operations are typed, any fields that take longer than 1ms to respond will be annotated to the right of the field inline! This gives team members a picture of how long the operation will take as more and more fields are added to operations or fragments.

<img src="https://raw.githubusercontent.com/apollographql/apollo-tooling/master/packages/vscode-apollo/images/marketplace/perf-annotation.png"  style="max-width:800px;" alt="Performance annotation next to a field">

<h3 id="syntax">Syntax highlighting</h3>

Apollo's editor extension provides syntax highlighting for all things GraphQL, including schema definitions in `.graphql` files, complex queries in TypeScript, and even client-only schema extensions. Syntax highlighting for GraphQL works out-of-the-box for `.graphql`, `.gql`, `.js` and `.ts` file types!

<h3 id="navigating-projects">Navigating projects</h3>

Navigating large codebases can be difficult, but the Apollo GraphQL extension makes this easier than ever. Right-clicking on any field in operations or schemas gives you the ability to jump to (or peek at) definitions, as well as find any other references to that field in your project. Searching a project for any occurrence of a certain field is now a thing of the past!

<img src="https://raw.githubusercontent.com/apollographql/apollo-tooling/master/packages/vscode-apollo/images/marketplace/jump-to-def.gif"  alt="Using jump to definition on a fragment">

<h3 id="commands">Schema tag switching</h3>

The Apollo GraphQL platform supports publishing multiple versions (tags) of a schema. This is useful for developing on a future development schema and preparing your clients to conform to that schema. To choose another schema tag, open the Command Palette (`cmd + shift + p` on mac), search "Apollo" and choose the "Apollo: Select Schema Tag" option.

<h2 id="troubleshooting">Troubleshooting</h2>

The most common errors are configuration errors, like a missing `.env` file or incorrect service information in the `apollo.config.js` file.
There is more information about configuring an Apollo projects [here](https://www.apollographql.com/docs/references/apollo-config.html).

Other errors may be caused from an old version of a published schema. To reload a schema, open the Command Palette (`cmd + shift + p` on mac), search "Apollo" and choose the "Apollo: Reload Schema" option.

Sometimes errors will show up as a notification at the bottom of your editor. Other, less critical messages may be shown in the output pane of the editor. To open the output pane and get diagnostic information about the extension and the current service loaded (if working with a client project), just click the "Apollo GraphQL" icon in the status bar at the bottom.

<img src="https://raw.githubusercontent.com/apollographql/apollo-tooling/master/packages/vscode-apollo/images/marketplace/stats.gif"  alt="Clicking the status bar icon to open the output pane">

If problems persist or the error messages are unhelpful, an [issue](https://github.com/apollographql/apollo-tooling/issues) can be opened on the `apollo-tooling` repository.
