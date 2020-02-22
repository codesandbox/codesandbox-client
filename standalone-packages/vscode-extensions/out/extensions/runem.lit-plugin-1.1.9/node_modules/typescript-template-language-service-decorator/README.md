# TypeScript Template Language Service Decorator

Framework for decorating a TypeScript language service with additional support for languages embedded inside of template strings.

[![Build Status](https://travis-ci.org/Microsoft/typescript-template-language-service-decorator.svg?branch=master)](https://travis-ci.org/Microsoft/typescript-template-language-service-decorator)

## Usage
This framework helps you to extend TypeScript's editor support for languagess embedded inside of template strings. It hides most of the details of dealing with template strings so that you only have to worry about working with the template string contents themselves.

Support for embedded template languages is implement using the `TemplateLanguageService` interface. Here's a simple `TemplateLanguageService` that adds completions that repeat the prior characters in a template string

```ts
import { TemplateLanguageService, TemplateContext } from 'typescript-template-language-service-decorator';

class EchoTemplateLanguageService implements TemplateLanguageService {
    getCompletionsAtPosition(
        context: TemplateContext,
        position: ts.LineAndCharacter
    ): ts.CompletionInfo {
        const line = context.text.split(/\n/g)[position.line];
        return {
            isGlobalCompletion: false,
            isMemberCompletion: false,
            isNewIdentifierLocation: false,
            entries: [
                {
                    name: line.slice(0, position.character),
                    kind: '',
                    kindModifiers: 'echo',
                    sortText: 'echo'
                }
            ]
        };
    }
}
```

The `TemplateLanguageService` operates on the contents of template nodes. `context.text` for example returns the text content of the template string, and the `position` passed to `getCompletionsAtPosition` is relative to the template string body.

The `decorateWithTemplateLanguageService` method takes a existing TypeScript language service and decorates it with a `TemplateLanguageService`. Here's how you would use this mehod to create a simple TypeScript server plugin for the `EchoTemplateLanguageService`

```ts
import * as ts from 'typescript/lib/tsserverlibrary';
import { decorateWithTemplateLanguageService } from 'typescript-template-language-service-decorator';

export = (mod: { typescript: typeof ts }) => {
    return {
        create(info: ts.server.PluginCreateInfo): ts.LanguageService {
            return decorateWithTemplateLanguageService(
                mod.typescript,
                info.languageService,
                info.project,
                new EchoTemplateLanguageService(),
                { tags: ['echo'] });
        }
    };
};
```

This plugin will now add echo completions to all template strings tagged with `echo`.


## Examples
For more advanced examples of using this library:

- [typescript-styled-plugin](https://github.com/Microsoft/typescript-styled-plugin)
- [typescript-lit-html-plugin](https://github.com/mjbvz/typescript-lit-html-plugin)


## Contributing

To build, you'll need [Git](https://git-scm.com/downloads) and [Node.js](https://nodejs.org/).

First, [fork](https://help.github.com/articles/fork-a-repo/) the typescript-template-language-service-decorator repo and clone your fork:

```bash
git clone https://github.com/YOUR_GITHUB_ACCOUNT_NAME/typescript-template-language-service-decorator.git
cd typescript-template-language-service-decorator
```

Then install dev dependencies:

```bash
npm install
```

The plugin is written in [TypeScript](http://www.typescriptlang.org). The source code is in the `src/` directory with the compiled JavaScript output to the `lib/` directory. Kick off a build using the `compile` script:

```bash
npm run compile
```

And then run the end to end tests with the `e2e` script:

```bash
(cd e2e && npm install)
npm run e2e
```

You can submit bug fixes and features through [pull requests](https://help.github.com/articles/about-pull-requests/). To get started, first checkout a new feature branch on your local repo:

```bash
git checkout -b my-awesome-new-feature-branch
```

Make the desired code changes, commit them, and then push the changes up to your forked repository:

```bash
git push origin my-awesome-new-feature-branch
```

Then [submit a pull request](https://help.github.com/articles/creating-a-pull-request/
) against the Microsoft typescript-template-language-service-decorator repository.

Please also see our [Code of Conduct](CODE_OF_CONDUCT.md).


## Credits

Code originally forked from: https://github.com/Quramy/ts-graphql-plugin