### 0.25.0 - 07.01.2019
* Fix issue with elm module parser using object spread in raw javascript (not transpiled). (by @joeandaverde)
* Fix issue with improperly invaliding old symbols in cache. (by @joeandaverde)
* Fix elm analyse path (by @Razzeee)
* The linter should also respect the module in "Make special path" (by @ccapndave)

### 0.24.0 - 26.11.2018
* Improved Symbol Search / Goto Definition (by @joeandaverde)
* Fix wrong missing compiler error message (by @andys8)
* Check isTestFile before normalizing path on windows (by @Krzysztof-Cieslak)

### 0.23.0 - 19.11.2018
* corrected a spelling error (by @WEBhicham)
* Replace inefficient regex to locate imports with simpler regex (by @joeandaverde)
* Add json schema support for Elm's config files (by @stephenreddek)
* Add support for running tests for Elm 0.19 (by @jackfranklin)

### 0.22.0 - 01.10.2018
* Fix a 0.18 elm-make configuration bug and support elm-format for 0.18 and 0.19 (by @hakonrossebo)
* Setting and logic to disable linting (by @hakonrossebo)
* Adds external package "oracle"-support for Elm 0.19 (by @r1sc)
* Handle breaking change in elm-format (by @hakonrossebo)

### 0.21.0 - 30.08.2018
* Set elm-make as default makeCommand for 0.18 and earlier (by @jackfranklin)
* Fix for Elm 0.19, find right project directory (by @norpan)
* Fix linting for errors for Elm 0.18 (by @jackfranklin)
* Changes REPL to use integrated terminal for interactivity (by @hakonrossebo)
* Make compiler errors a little easier to read (by @norpan)
* Separate example code for 0.18 and 0.19 (by @hakonrossebo)
* Fixes to omit Elm Oracle for 0.19 and read elm.json (by @hakonrossebo)
* Using terminal instead of output window to install packages for y/n (by @hakonrossebo)

### 0.20.0 - 24.08.2018
* Snippets: Let expression indentation (elm-format) (by @andys8)
* Add ability to configure elm-package locating. (by @jackfranklin)
* Syntax Polish (by @mdgriffith)
* Elm 0.19 update (by @hakonrossebo and @7sharp9)

### 0.19.0 - 27.07.2018
* Snippets: Add todo comment snippet (by @andys8)
* Refactoring diagnostic init for LS (by @lostintangent)
* Grammar updates (by @mdgriffith)
* Compilable Msg placeholder in HTML.program snippet (by @milesfrain)
* Info about editor.formatOnSaveTimeout on Windows (by @rofrol)

### 0.18.0 - 22.05.2018
* Make linting work again with elm-analyse 0.14.2 (by @Yarith)
* Handle formatSelection the same as formatDocument (by @milesfrain)

### 0.17.0 - 26.04.2018
* Limiting workspace symbols and linting to local files (by @lostintangent)
* Fixed issue with elm-make and spaces in paths (by @Arbyy)
* Fix error message not clearing when formatting with elm-format (by @adam77)
* Make folding not eat up empty lines (by @szabba)

### 0.16.0 - 11.02.2018
*  Jump to symbol based on imports. Jump to symbol that has been fully qualified such as `MyModule.myFunction` (by @joeandaverde)
* Fix cursor moving when formatting with elm-format (by @adam77)
* Support elm code syntax highlighting in markdown files (by @kachkaev)
* Snippets improvement (by @andys8)
* Fix `elm.makeCommand` sample path for Windows (by @lukaszgasior)

### 0.15.1 - 03.10.2017
* added prettier to the project (by @littleStudent)
* Fix package installation  (by @wolverian)
* save file only once formatting is finished (by @gyzerok)
* Snippets for elm-test test and describe blocks (by @andys8 )

### 0.15.0 - 10.08.2017
* Add integration with `Elm-analyse` (by @hakonrossebo)
* Use TsLint on `vscode-elm` code base (by @littleStudent)

### 0.14.1 - 21.06.2017
* Added the ability to include function/type/type alias comments in intellisense (by @andrewsdev)
* Fixed bugs in parsing elm-oracle hover results and bugs in userProject hover results (by @andrewsdev)

### 0.14.0 - 15.06.2017
* Fix defaultModel snippet, Add Html.program snippet (by @iocube)
* Bugfix: Error with one-line suggested annotation (by @hakonrossebo)
* Handle block comments (by @hakonrossebo)
* Improvements/bug fixes for user project intellisense (by @andrewsdev):
  - Bug fix: writing type signature before writing the function definition behavior
  - Bug fix: `/as/` regex for the list of imports behavior
  - Bug fix: name of a user's type or type alias were not included in intellisense results
  - Feature: Primitive types are now included in autocomplete when writing a function definition
  - Feature: limit on user intellisense 'comment' size now better indicates it has hit a settings limit
  - Feature: Can now set `elm.userProjectMaxCommentSize` to 0 to bypass the limit on user intellisense 'comment' size
  - Feature: Working Intellisense (hover and autocomplete) for user modules with a '.'. Custom configuration to control this feature.

### 0.13.0 - 08.06.2017
* Workspace symbols implementation (by @hakonrossebo)
* Elm-reactor subdir traversal (by @hakonrossebo)
* Command to stop Elm REPL (by @hakonrossebo)
* Elm-make uses path correctly. Also introduce special file config (by @hakonrossebo)

### 0.12.0 - 03.06.2017
* add auto-closing quotes to config (by @kojuro-kun)
* Changes snippets to 4 space indentation (by @hakonrossebo)
* Fixes double module name in autocomplete (by @hakonrossebo)
* Autocomplete handles aliased module names (by @hakonrossebo)
* Elm-format error as StatusBar instead of ErrorMessage (by @hakonrossebo)
* Initial implementation of CodeActions (function type annotations, misspelled variable names, types and patterns) (by @hakonrossebo)
* Implements go to definition for document (by @hakonrossebo)

### 0.11.2 - 10.05.2017
* Improved Linter so that issues are associated with the correct files (by @danheuck )
* Fix for elm-oracle being fed entire elm file (by @dannyob)

### 0.11.1 - 10.05.2017
* Fix keyboard shortcuts

### 0.11.0 - 08.05.2017
* Add `Elm: Browse package` command
* Fix paths concatenation issue for non-Windows machines

### 0.10.0 - 05.05.2017

* Initial changelog entry, so all working features are listed:

* Syntax highlighting
* Autocomplete (for external packages and experimentally for local projects)
* Error highlighting
* Code formatting
* Hover info (for external packages and experimentally for local projects)
* Document Symbol provider
* Integration with Elm Reactor
* Integration with Elm Make
* Integration with Elm Package
* REPL support
* Custom Elm Snippets

