---
banner: ./images/banner.png
slug: creating-a-parallel-offline-extensible-browser-based-bundler-for-codesandbox
authors: ['Ives van Hoorne']
photo: https://avatars0.githubusercontent.com/u/587016?s=460&v=4
title:
  Creating a parallel, offline, extensible, browser based bundler for
  CodeSandbox
description:
  Finding the right balance between the look and feel of Webpack, and using
  browser based technologies.
date: 2017-08-27
---

When I first started [CodeSandbox](https://codesandbox.io), I was completely
focused on [React](/framework/react) development. We even named it
'ReactSandbox' at first, but I changed it to CodeSandbox last minute so we could
expand to other libraries. I'm proud to say that we now succeeded in that
regard!

The past week we slowly rolled out support for other libraries. We now have
support for React, [Vue](/framework/vue) and [Preact](/framework/preact)
templates and are planning to support [Angular](/framework/angular),
[ReasonML](https://github.com/facebook/reason) and [Svelte](/framework/svelte)
(let me know if you have other suggestions). To make this happen I had to
rewrite the bundler from scratch. In this post I will explain mostly how the new
bundler is built and what decisions I took to get there.

<!-- https://vue.codesandbox.io -->

https://codesandbox.io/s/vue?fontsize=14&view=split

<!-- Vue -->

<!-- https://preact.codesandbox.io -->

https://codesandbox.io/s/preact?fontsize=14&view=split

<!-- Preact -->

## Past

The first bundler we used was _very_ primitive: for each requested file we would
first transpile it, evaluate it and then cache the result. When a file changed
we would just throw away the cache for all files dependent on that file and
start over again. This worked for [Babel](https://github.com/babel/babel), but
wouldn't work for other loaders that need asynchronous transpiling like
[Sass](https://github.com/sass/sass). Creating
[transpilers](https://en.wikipedia.org/wiki/Source-to-source_compiler) for e.g.
Vue turned out to be even harder in the old system. It was evident that I had to
rethink the bundling process if we want to support libraries like Vue, plus it
would give me the chance to improve the bundler.

#### webpack in the browser

My first idea was to make [`webpack`](https://github.com/webpack/webpack) work
in the browser. Almost all existing CLIs already use `webpack` and it would
require no work to add a new loader if it already works with `webpack`.
Exporting to a `webpack.config.js` for the download function would also be
effortless and users would be able to provide their own config. Sounds like the
perfect scenario, right? For me as well! It sounds too good to be true, and it
turned out to be.

I got `webpack` running in the browser, however the bundle size was 3.5MB
uglified. I had to provide many polyfills and compilation threw a dozen warnings
because of dynamic requires. Furthermore, only half of the loaders worked.
`webpack` assumes a [Node](/software/node) environment, and it turned out that
the cost to simulate that environment was (in my opinion) too big for the
advantages gained from it. My second reason is that CodeSandbox is a very
specific platform, and if we build the bundler ourselves we can completely
optimize for that platform.

#### webpack Loader API in the browser

My second idea was to write my own bundler, but with a loader API very close to
`webpack`. The advantage of this is that the bundler "feels" like `webpack`, but
is optimized for a browser environment. Writing loaders would be very easy; we
can just take an existing `webpack` loader, strip all SSR, Node and production
logic away and it _should_ work in CodeSandbox. Another **big** advantage is
that we assume a browser environment, so we can abuse browser APIs like
[Web Workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API),
[Service Workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
and code splitting!

## Implementation

For the actual implementation I tried to achieve the best of both worlds: close
loader API surface with `webpack` and full optimization for CodeSandbox. It
should work faster than first bundler, work offline and it should be extensible.
The final bundler distinguishes three phases: configuration, transpilation and
evaluation.

#### Configuration

The new bundler has been built with templates in mind. For every template we
have (currently React, Vue and Preact) we define a new preset. These presets
contain configurations you can also find in a `webpack` config: aliases, default
loaders and default extensions. The function of a `Preset` is to return what
loaders are used for a file type, and how files are resolved. The `Preset` for
Preact looks like this:

```js
import babelTranspiler from '../../transpilers/babel';
import jsonTranspiler from '../../transpilers/json';
import stylesTranspiler from '../../transpilers/css';
import sassTranspiler from '../../transpilers/sass';
import rawTranspiler from '../../transpilers/raw';
import stylusTranspiler from '../../transpilers/stylus';
import lessTranspiler from '../../transpilers/less';

import asyncTranspiler from './transpilers/async';

import Preset from '../';

const preactPreset = new Preset(
  'preact-cli',
  ['js', 'jsx', 'ts', 'tsx', 'json', 'less', 'scss', 'sass', 'styl', 'css'],
  {
    preact$: 'preact',
    // preact-compat aliases for supporting React dependencies:
    react: 'preact-compat',
    'react-dom': 'preact-compat',
    'create-react-class': 'preact-compat/lib/create-react-class',
    'react-addons-css-transition-group': 'preact-css-transition-group',
  }
);

preactPreset.registerTranspiler(module => /\.jsx?$/.test(module.title), [
  {
    transpiler: babelTranspiler,
    options: {
      presets: [
        // babel preset env starts with latest, then drops rules.
        // We don't have env, so we just support latest
        'latest',
        'stage-1',
      ],
      plugins: [
        'transform-object-assign',
        'transform-decorators-legacy',
        ['transform-react-jsx', { pragma: 'h' }],
        [
          'jsx-pragmatic',
          {
            module: 'preact',
            export: 'h',
            import: 'h',
          },
        ],
      ],
    },
  },
]);

preactPreset.registerTranspiler(module => /\.s[a|c]ss/.test(module.title), [
  { transpiler: sassTranspiler },
  { transpiler: stylesTranspiler },
]);

preactPreset.registerTranspiler(module => /\.less/.test(module.title), [
  { transpiler: lessTranspiler },
  { transpiler: stylesTranspiler },
]);

preactPreset.registerTranspiler(module => /\.json/.test(module.title), [
  { transpiler: jsonTranspiler },
]);

preactPreset.registerTranspiler(module => /\.styl/.test(module.title), [
  { transpiler: stylusTranspiler },
  { transpiler: stylesTranspiler },
]);

// Support for !async statements
preactPreset.registerTranspiler(
  () => false /* never load without explicit statement */,
  [{ transpiler: asyncTranspiler }]
);

// This transpiler is backup for all other files
preactPreset.registerTranspiler(() => true, [{ transpiler: rawTranspiler }]);

export default preactPreset;
```

#### Transpilation

Transpilation is the most important phase. Like the name implies: it does
transpilation, but it's also responsible for building the dependency graph. For
every transpiled file we traverse the
[AST](https://en.wikipedia.org/wiki/Abstract_syntax_tree), search for all
require statements, and add them to the tree. This doesn't only happen to `.js`
files, it also happens for
[TypeScript](https://github.com/Microsoft/TypeScript),
[Sass](https://github.com/sass/sass), [LESS](https://github.com/less/less.js)
and [Stylus](https://github.com/stylus/stylus) files. The advantage of building
the tree during transpilation is that we only have to build the AST once.

Transpiled output is saved in a
[`TranspiledModule`](https://github.com/codesandbox/codesandbox-client/blob/52b5cc248fe25fd37de034d5a39a286e395817e3/packages/app/src/sandbox/eval/transpiled-module.js).
One file can be associated with multiple `TranspiledModule`s, because files can
be required in different ways. For example, `require('raw-loader!./Hello.js')`
isn't the same as `require('./Hello.js')`.

https://codesandbox.io/s/q8kjprjnww?fontsize=14&view=split

<!-- Different require syntax is supported! -->

#### Web Workers

A very important improvement is that almost all transpilation happens in
parallel using a web worker pool manager based on your amount of cores. This
means that we use separate threads for transpilation, so transpilation happens
in parallel by default. This removes load from the UI thread (reduces stutters)
and also greatly improves transpilation time: for me the transpilation time (and
thus loading time) was 2 to 4 times shorter! Transpilation is the only
asynchronous stage of the three.

https://twitter.com/brian_d_vaughn/status/901488766581227520

<!-- What happens if you move Babel into a web worker? -->

#### Code Splitting

Every loader is dynamically loaded based on their usage. If your sandbox only
contains JavaScript files, we will only download the Babel loader. This saves a
lot of time and bandwidth, since transpilers tend to be very big.

#### Offline Support

One of the requirements of the bundler is to work offline, that's why all the
unused loaders are still downloaded in the background by a service worker. There
are no external dependencies while working on a sandbox, so after downloading
the transpilers it can bundle offline whenever wherever.

#### Evaluation

Although I've called this bundler a 'bundler', there is actually no bundling
happening! We already have access to all the code, so the only task left to do
is evaluation of the correct file. The entry point gets evaluated using a simple
[`eval`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval),
we provide a stubbed require that resolves the correct `TranspiledModule` and
either evaluates it or returns the cache if it exists.

#### 'Hot Module Reloading'

The output of transpilation and evaluation are cached. When a file changes we
throw away the transpilation of that specific file and compilation of that file
and all parents (all files requireing that file). From that point we transpile
and evaluate from the entry point again. I put HMR into quotes, because this is
not the same implementation as the real HMR solution. We don't have
`​module.hot`​, because it would take a setup to make HMR work in a sandbox and
I wanted it to work out of the box. (_edit: we now do support `​module.hot`
since CodeSandbox 2.5!_)

## Conclusion

I'm proud of this bundler, as it allows us to do more and is also much faster
than the previous version. With the new implementation we have the best of both
worlds; we have a close API surface with `webpack` and it's optimized for
CodeSandbox and the browser. It's of course not as advanced as other solutions
like `webpack`, but it's perfect for CodeSandbox. It now doesn't take longer
than an hour to add a new template and loaders are very easy to port from their
`webpack` counterparts. This makes us very flexible in the future.

#### Performance

The performance has also improved with the new bundler. Initial load time can be
pretty high, because the transpilers need to be downloaded. All transpilers are
cached using service workers or browser cache though, so on second try it should
be much faster. Initial compilation takes between 1 and 2 seconds on my Macbook
13" 2015, all recompilation takes between 35 and 40 milliseconds(!). These tests
were run on
[the TodoMVC implementation of Redux](https://github.com/reduxjs/redux/tree/master/examples/todomvc).
It's faster because transpilation now happens in parallel on separate threads
and transpilation already starts while dependencies are being fetched.

#### Source

If you want to see the real goods; you can find the source
[here](https://github.com/codesandbox/codesandbox-client/blob/52b5cc248fe25fd37de034d5a39a286e395817e3/packages/app/src/sandbox/eval/manager.js).
This is the `Manager` class, it's responsible for connecting the `Sandbox`, the
`Preset` and all `TranspiledModule`s.

## Future

The new bundler opens a lot of exciting possibilities. The two biggest are
custom template support and full offline support.

#### Custom Template Support

We now have all these loaders like Sass and TypeScript, it would be nice if we
could also unlock these for the React sandboxes. There should be a button to
`eject` a sandbox, which enables you to specify loaders and things like custom
Babel configuration. The main work for this has already been done, we only need
the API to support it next.

#### Full Offline Support

Everything works offline already, but for full offline support we need to allow
you to save sandboxes offline. This allows you to work offline on your projects
forever, and upload to CodeSandbox whenever you'd like. The only feature that
requires an internet connection are [npm](https://npmjs.com) dependencies, but
we already cache all npm results. We'll give you the option to precache
combinations for when you're planning a trip or flight.
