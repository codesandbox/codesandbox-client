<h1 align="center"><img src="https://cdn.rawgit.com/kumarharsh/graphql-for-vscode/master/images/logo.png" alt="Logo" height="128" /></h1>
<h2 align="center">Graphql For VSCode</h2>
<div align="center">

  [![Latest Release](https://vsmarketplacebadge.apphb.com/version-short/kumar-harsh.graphql-for-vscode.svg)](https://marketplace.visualstudio.com/items?itemName=kumar-harsh.graphql-for-vscode)
  [![Installs](https://vsmarketplacebadge.apphb.com/installs-short/kumar-harsh.graphql-for-vscode.svg)](https://marketplace.visualstudio.com/items?itemName=kumar-harsh.graphql-for-vscode)
  [![Rating](https://vsmarketplacebadge.apphb.com/rating-short/kumar-harsh.graphql-for-vscode.svg)](https://marketplace.visualstudio.com/items?itemName=kumar-harsh.graphql-for-vscode)


  [![Semantic Release](https://img.shields.io/badge/%20%20%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
  [![Greenkeeper badge](https://badges.greenkeeper.io/kumarharsh/graphql-for-vscode.svg)](https://greenkeeper.io/)
</div>

<hr>

VSCode extension for GraphQL schema authoring & consumption.

![A preview of the extension](https://cdn.rawgit.com/kumarharsh/graphql-for-vscode/master/images/preview.png)


## What's in the Box?

* **Go to Definition**: Just <kbd>F12</kbd> or <kbd>Ctrl</kbd>+Click on any graphql type, and you'll jump right to it's definition.

    ![Go to Definition](https://cdn.rawgit.com/kumarharsh/graphql-for-vscode/master/images/goto-definition.gif)
* **Autocomplete**: Uses the [@playlyfe/gql](https://npmjs.org/package/@playlyfe/gql) library to read your whole graphql schema definitions and provide you with autocomplete support while writing & editing your `.gql` files.

  ![Autocomplete](https://cdn.rawgit.com/kumarharsh/graphql-for-vscode/master/images/autocomplete.gif)
* **Schema Validation**: The plugin also validates your schema, so that you catch errors early.
* **Linting**: This plugin uses a similar method as used by the [Codemirror graphql](https://github.com/graphql/codemirror-graphql) project for linting.
* **Great Syntax Highlighting**: Now, your graphql queries, mutations and gql files will look as beautiful as the rest of your code with an awesome syntax highlighter. It works not just with your .gql/.graphql schema files, but also within your code - supports syntax highlighting within:
  + Javascript
  + Typescript
  + Vue
  + Ruby
  + Cucumber
  + ReasonML/OCaml
  + Markdown fenced code-blocks
  + (Submit a PR to support your language!)

* **Snippets**: Some commonly used snippets are provided which help while writing mutations and queries, such as defining types, interfaces and input types.

## Setting it Up
1. Ensure that you have the [@playlyfe/gql](https://npmjs.org/package/@playlyfe/gql) library (v2.x) installed and available to this plugin. If you've installed the library in a folder other than the workspace root, then add the path to the node_modules directory as a setting:
    ```json
    {
      "graphqlForVSCode.nodePath": "ui/node_modules"
    }
    ```

2. Ensure you have [watchman](https://facebook.github.io/watchman/docs/install.html) installed and available in your path. Watchman watches your gql files and provides up-to-date suggestions. For users on Windows, get the latest build mentioned in [this issue](https://github.com/facebook/watchman/issues/19) and add the location of `watchman.exe` to your environment path.

3. Create a .gqlconfig file (required by the `@playlyfe/gql` package).

    ### A minimal example:
    The .gqlconfig is a JSON file with only one required key: schema.files which is the path to your *.gql files relative to your workspace root.
    ```js
    /* .gqlconfig */
    {
      schema: {
        files: 'schemas/**/*.gql'
      }
    }
    ```
    You can use the string `files: "**/*.gql"` instead if you want to find any `.gql` file recursively in the workspace dir.

    To see the full configuration, check out the [GQL](https://github.com/Mayank1791989/gql) project's docs.

4. To enable autocomplete support within your code, add these lines to your `.gqlconfig` file. The `query` section of the config contains an array of `file` config with matchers. You can add more files by directing the `EmbeddedQueryParser` to run when your code within the `startTag` and `endTag` matches:
    ```js
    /* .gqlconfig */
    {
      schema: {
        files: "schemas/**/*.gql"
      },
      query: {
        files: [ /* define file paths which you'd like the gql parser to watch and give autocomplete suggestions for */
          {
            match: 'ui/src/**/*.js', // for js
            parser: ['EmbeddedQueryParser', { startTag: 'Relay\\.QL`', endTag: '`' }],
            isRelay: true,
          },
          {
            match: 'features/**/*.feature', // for gherkin
            parser: ['EmbeddedQueryParser', { startTag: 'graphql request\\s+"""', endTag: '"""' }],
          },
          {
            "match": "lib/**/*.rb", // sample config you might use for Ruby-aware highlighting (inside `<<-GRAPHQL` heredocs)
            "parser": ["EmbeddedQueryParser", { "startTag": "<<-GRAPHQL", "endTag": "GRAPHQL" }]
          },
          {
            match: 'fixtures/**/*.gql',
            parser: 'QueryParser',
          },
        ],
      },
    }
    ```

    Again, refer to [GQL](https://github.com/Mayank1791989/gql) docs for details about configuring your .gqlconfig.

## Future Plans
* Tests: Figure out tests.

## Contributing
* If you have a suggestion or a problem, please open an issue.
* If you'd like to improve the extension:
  + If you've made any improvements to the extension, send a Pull Request!
  + The instructions to run the server are [here](#server)
  + The instructions to run and debug the client are [here](#hacking)

## Hacking

#### Client
If you're making changes to the client, then run `npm run watch` inside this directory,
then just press <kbd>F5</kbd> to launch the *Extension Development Host* instance of vscode. Whenever you make a change, press *Reload* to reload the EDH instance.

#### Server
If you're making changes to the server, then run `npm run watch-server` from the root directory. Then, run the client in debug mode. If you make any change in the server code, you need to reload the *Extension Development Host* instance of vscode.

## Major Contributors
* [Mayank Agarwal](https://github.com/Mayank1791989) - added autocomplete, goto definition, schema validation support

## Changelog
* Latest changes are available on the [releases](https://github.com/kumarharsh/graphql-for-vscode/releases) page.
* Older changelogs can be found [here](https://github.com/kumarharsh/graphql-for-vscode/blob/master/CHANGELOG.md).

---

*Happy Querying!*
