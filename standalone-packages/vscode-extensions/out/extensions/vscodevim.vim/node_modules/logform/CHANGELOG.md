# CHANGELOG

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
