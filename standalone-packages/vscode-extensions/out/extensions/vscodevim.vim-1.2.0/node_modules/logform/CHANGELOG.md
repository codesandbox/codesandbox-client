# CHANGELOG

### 2.1.1
**2019/01/29**

- [#71] Bump logform to be consistent with winston.
   - Fixes https://github.com/winstonjs/winston/issues/1584

### 2.1.0
**2019/01/07**

- [#59], [#68], [#69]  Add error normalizing format.
- [#65] When MESSAGE symbol has a value and `{ all: true }` is set, colorize the entire serialized message.

### 2.0.0
**2018/12/23**

- **BREAKING** [#57] Try better fix for [winston#1485]. See:
  [New `splat` behavior`](#new-splat-behavior) below.
- [#54] Fix typo in `README.md`
- [#55] Strip info[LEVEL] in prettyPrint. Fixes [#31].
- [#56] Document built-in formats.
- [#64] Add TypeScript definitions for all format options.
  Relates to [#9] and [#48].

#### New `splat` behavior

Previously `splat` would have added a `meta` property for any additional
`info[SPLAT]` beyond the expected number of tokens.

**As of `logform@2.0.0`,** `format.splat` assumes additional splat paramters
(aka "metas") are objects and merges enumerable properties into the `info`.
e.g.

``` js
const { format } = require('logform');
const { splat } = format;
const { MESSAGE, LEVEL, SPLAT } = require('triple-beam');

console.log(
  // Expects two tokens, but three splat parameters provided.
  splat().transform({
    level: 'info',
    message: 'Let us %s for %j',
    [LEVEL]: 'info',
    [MESSAGE]: 'Let us %s for %j',
    [SPLAT]: ['objects', { label: 'sure' }, { thisIsMeta: 'wut' }]
  })
);

// logform@1.x behavior:
// Added "meta" property.
//
// { level: 'info',
//   message: 'Let us objects for {"label":"sure"}',
//   meta: { thisIsMeta: 'wut' },
//   [Symbol(level)]: 'info',
//   [Symbol(message)]: 'Let us %s for %j',
//   [Symbol(splat)]: [ 'objects', { label: 'sure' } ] }

// logform@2.x behavior:
// Enumerable properties assigned into `info`.
//
// { level: 'info',
//   message: 'Let us objects for {"label":"sure"}',
//   thisIsMeta: 'wut',
//   [Symbol(level)]: 'info',
//   [Symbol(message)]: 'Let us %s for %j',
//   [Symbol(splat)]: [ 'objects', { label: 'sure' } ] }
```

The reason for this change is to be consistent with how `winston` itself
handles `meta` objects in its variable-arity conventions.

**BE ADVISED** previous "metas" that _were not objects_ will very likely lead
to odd behavior. e.g.

``` js
const { format } = require('logform');
const { splat } = format;
const { MESSAGE, LEVEL, SPLAT } = require('triple-beam');

console.log(
  // Expects two tokens, but three splat parameters provided.
  splat().transform({
    level: 'info',
    message: 'Let us %s for %j',
    [LEVEL]: 'info',
    [MESSAGE]: 'Let us %s for %j',
    // !!NOTICE!! Additional parameters are a string and an Array
    [SPLAT]: ['objects', { label: 'sure' }, 'lol', ['ok', 'why']]
  })
);

// logform@1.x behavior:
// Added "meta" property.
//
// { level: 'info',
//   message: 'Let us objects for {"label":"sure"}',
//   meta: ['lol', ['ok', 'why']],
//   [Symbol(level)]: 'info',
//   [Symbol(message)]: 'Let us %s for %j',
//   [Symbol(splat)]: [ 'objects', { label: 'sure' } ] }

// logform@2.x behavior: Enumerable properties assigned into `info`.
// **Strings and Arrays only have NUMERIC enumerable properties!**
//
// { '0': 'ok',
//   '1': 'why',
//   '2': 'l',
//   level: 'info',
//   message: 'Let us objects for {"label":"sure"}',
//   [Symbol(level)]: 'info',
//   [Symbol(message)]: 'Let us %s for %j',
//   [Symbol(splat)]: [ 'objects', { label: 'sure' } ] }
```

### 1.10.0
**2018/09/17**

- [#52] Add types field in package.json.
- [#46], [#49] Changes for splat when there are no tokens present and no splat present.
- [#47], [#53] Expose transpiled code for Browser-only scenarios.  

### 1.9.1
**2018/06/26**

- [#39] Don't break when there are % placeholders but no values.
- [#42] Only set `meta` when non-zero additional `SPLAT` arguments are
  provided. (Fixes [winstonjs/winston#1358]).

### 1.9.0
**2018/06/12**

- [#38] Migrate functionality from winston Logger to splat format.
- [#37] Match expectations from `winston@2.x` for padLevels. Create a correct `Cli` format with initial state. (Fixes [#36]).

### 1.8.0
**2018/06/11**

- [#35] Use `fast-safe-stringify` for perf and to support circular refs.
- [#34] Colorize level symbol.

### 1.7.0
**2018/05/24**

- [#28] Use more es6-features across the board.
- [#30] Fix combine return value.
- [#29] Add metadata function to format namespace.

### 1.6.0
**2018/04/25**

- [#25] Implement padLevels format.
- [#26] Update `dependencies` and add `node@10` to the travis build of the project.
- [#27] Refactor logform to use triple-beam.

### 1.5.0
**2018/04/22**

- [#23], (@ChrisAlderson) Add ms format to support '+N ms' format. Fixes #20.
- [#24], (@aneilbaboo) Fix `webpack` warnings.
- Add `.travis.yml`.

### 1.4.2
**2018/04/19**

- [#22], (@Jasu) Fix compilation on Babel 6.

### 1.4.1
**2018/04/06**

- [#21], (@dabh) Add tsconfig.json. Fixes #19.

### 1.4.0
**2018/03/23**

- [#14] @iamkirkbater Added Initial Metadata Support. 
- Correct JSDoc for printf.js. Fixes #10.

### 1.3.0
**2018/03/16**

- [#18] Expose browser.js for rollup and the like. Fixes [#5].
- [#13] @dabh Use new version of colors.
- [#15] @dabh Add Typescript typings (ported from DefinitelyTyped).
- [#17], [#16] Fix error messages other typos.

### 1.2.2
**2017/12/05**

- [#4], [#11] Fix timestamp and replace `date-fns` with `fecha` (with test cases) [`@ChrisAlderson`].

### 1.2.1
**2017/10/01**

- [#3] Strip `info.splat` in `format.simple` to avoid double inclusion.

### 1.2.0
**2017/09/30**

- Transition from `info.raw` to `info[Symbol.for('message')]`.
- Finish `README.md` except for full list of all built-in formats.
- 100% coverage for everything except for `{ align, cli, padLevels }`.

### 1.1.0
**2017/09/29**

- [#2] Add baseline expected formats that were previously exposed as options to `common.log` in `winston@2.x` and below.
- [#2] Introduce `format.combine` to remove inconsistency in behavior between `format(fn0)` and `format(fn0, ...moreFns)`.
- [#2] `README.md` now covers all of the basics for `logform`.

### 1.0.0
**2017/09/26**

- Initial release.

[winstonjs/winston#1358]: https://github.com/winstonjs/winston/issues/1358
