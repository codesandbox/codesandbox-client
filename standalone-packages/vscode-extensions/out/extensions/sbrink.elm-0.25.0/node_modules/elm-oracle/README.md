# elm-oracle

Elm Oracle intends to be a standalone program that can be used by all editor plugins to query information about a project's source code.

## Installation

You need [node](http://nodejs.org) to install and run elm-oracle.

```
npm install -g elm-oracle
```

## Usage

elm-oracle <source_file> <string_query>

The return value will be a json array of json objects with information for each value that starts with the query string.

`elm-oracle Main.elm Signal.message` might return:

```json
[{"name":"message","fullName":"Signal.message","href":"http://package.elm-lang.org/packages/elm-lang/core/latest/Signal#message","signature":"Address a -> a -> Message","comment":"Create a message that may be sent to a `Mailbox` at a later time.\n\nMost importantly, this lets us create APIs that can send values to ports\n*without* allowing people to run arbitrary tasks."}]
```

Where as `elm-oracle Main.elm Signal.m` might include Signal.mailbox, Signal.map, etc.

This information is used in [elm-vim](http://github.com/elmcast/elm-vim) to show the type, docs, and completions of tokens in the source file.

## Development

You can make any changes to the source and run `npm run-script local-deploy` which will compile, make the binary, and globally install elm-oracle. You can read the contents of 'make-bin' first to verify that it isn't going to set your laptop on fire.
