# Changelog
## v1.8.8

### Description


### Closed Issues
*  async function in object wrong indentation ([#1573](https://github.com/beautify-web/js-beautify/issues/1573))


## v1.8.7

### Description


### Closed Issues
* Add tests for html  `indent_scripts` option ([#1518](https://github.com/beautify-web/js-beautify/issues/1518))
* Support dynamic import ([#1197](https://github.com/beautify-web/js-beautify/issues/1197))
* HTML: add an option to preserve manual wrapping of attributes ([#1125](https://github.com/beautify-web/js-beautify/issues/1125))
* js-beautify adds a space between # and include ([#1114](https://github.com/beautify-web/js-beautify/issues/1114))
* space_after_anon_function doesn't work with anon async functions ([#1034](https://github.com/beautify-web/js-beautify/issues/1034))
* Space before function arguments (space-after-function) ([#608](https://github.com/beautify-web/js-beautify/issues/608))


## v1.8.6

### Description
Beautifier has moved to https://beautifier.io

### Closed Issues
* JS beautify break the angular compile ([#1544](https://github.com/beautify-web/js-beautify/issues/1544))
* base64 string is broken with v1.8.4 ([#1535](https://github.com/beautify-web/js-beautify/issues/1535))
* Bookmarklet becomes totally useless ([#1408](https://github.com/beautify-web/js-beautify/issues/1408))
* HTTPS ([#1399](https://github.com/beautify-web/js-beautify/issues/1399))
* Beautify breaks when js starts with space followed by multi-line comment ([#789](https://github.com/beautify-web/js-beautify/issues/789))


## v1.8.4

### Description
Broader adoption of 1.8.x revealed a few more high priority fixes


### Closed Issues
* Multiple newlines added between empty textarea and "unformatted" inline elements  ([#1534](https://github.com/beautify-web/js-beautify/issues/1534))
* unindent_chained_methods broken ([#1533](https://github.com/beautify-web/js-beautify/issues/1533))


## v1.8.1

### Description


### Closed Issues
* Why npm is a dependency? ([#1516](https://github.com/beautify-web/js-beautify/issues/1516))
* indent_inner_html not working in v1.8.0 ([#1514](https://github.com/beautify-web/js-beautify/issues/1514))


## v1.8.0

### Description
Massive set of fixes and improvements.

Thanks to contributors: @cheerypick, @swan46, @MacKLess, @Elrendio, @madman-bob, @amanda-bot, @Hirse, @aeschli, and many more.

Special thanks to @astronomersiva and @garretwilson for finding key bugs in the RC releases,
and to @MacKLess for driving down the open bug count with tons of regression tests.

Highlights:

* CSS: `newline_between_rules` support for nested rules - CSS/SASS/SCSS/LESS  (@MacKLess)
* CSS: @import support in CSS (@MacKLess)
* HTML: inline element support (@madman-bob)
* HTML: `wrap_attributes` setting `align-multiple` (@cheerypick)
* HTML: optional close tags do not over indent - li, tr, etc.
* HTML: Improved line wrapping in HTML - still not fully correct
* HTML: 10x performance improvement in HTML beautifier
* JS: ES6 BigInt support (@thejoshwolfe)
* JS: ES6 Dynamic import support 
* CSS: :hover for @extend formatting (@MacKLess)
* HTML: Incorrect line wrapping issue (@andreyvolokitin)
* JS: Javascript ++ Operator Indentation (@Elrendio)
* JS: Better packer handling in Python (@swan46)





### Closed Issues
* list items of nested lists get indented backwards ([#1501](https://github.com/beautify-web/js-beautify/issues/1501))
* Make beautifier auto-convert options with dashes into underscores ([#1497](https://github.com/beautify-web/js-beautify/issues/1497))
* ReferenceError: token is not defined ([#1496](https://github.com/beautify-web/js-beautify/issues/1496))
* Publish v1.8.0 ([#1495](https://github.com/beautify-web/js-beautify/issues/1495))
* still probem #1439 / #1337 ([#1491](https://github.com/beautify-web/js-beautify/issues/1491))
* Duplicating HTML Code Nested In PHP ([#1483](https://github.com/beautify-web/js-beautify/issues/1483))
* Handlebars - `if` tags are broken when using helper with `textarea` ([#1482](https://github.com/beautify-web/js-beautify/issues/1482))
* TypeError: Cannot read property '1' of null ([#1481](https://github.com/beautify-web/js-beautify/issues/1481))
* Space in Self Closing Tag Issue ([#1478](https://github.com/beautify-web/js-beautify/issues/1478))
* Weird Formatting in VSCode ([#1475](https://github.com/beautify-web/js-beautify/issues/1475))
* Indent with tab issue on website ([#1470](https://github.com/beautify-web/js-beautify/issues/1470))
* Contents of hbs tags are converted to lowercase ([#1464](https://github.com/beautify-web/js-beautify/issues/1464))
* HTML tags are indented wrongly when attributes are present ([#1462](https://github.com/beautify-web/js-beautify/issues/1462))
* hbs tags are stripped when there is a comment below or inline ([#1461](https://github.com/beautify-web/js-beautify/issues/1461))
* Spaces added to handlebars with '=' ([#1460](https://github.com/beautify-web/js-beautify/issues/1460))
* jsbeautifier.org don't works ([#1445](https://github.com/beautify-web/js-beautify/issues/1445))
* Commenting code and then beautifying removes line breaks ([#1440](https://github.com/beautify-web/js-beautify/issues/1440))
* Less: Where is my space? ([#1411](https://github.com/beautify-web/js-beautify/issues/1411))
* No newline after @import ([#1406](https://github.com/beautify-web/js-beautify/issues/1406))
* "html.format.wrapAttributes": "force-aligned" adds empty line on long attributes ([#1403](https://github.com/beautify-web/js-beautify/issues/1403))
* HTML: wrap_line_length is handled incorrectly ([#1401](https://github.com/beautify-web/js-beautify/issues/1401))
* js-beautify is breaking code by adding space after import ([#1393](https://github.com/beautify-web/js-beautify/issues/1393))
* JS-Beautify should format XML tags inside HTML files ([#1383](https://github.com/beautify-web/js-beautify/issues/1383))
* python unpacker can not handle if radix given as [] and not as a number ([#1381](https://github.com/beautify-web/js-beautify/issues/1381))
* unindent_chained_methods breaks indentation for if statements without brackets  ([#1378](https://github.com/beautify-web/js-beautify/issues/1378))
* function parameters merged into single line when starting with ! or [ ([#1374](https://github.com/beautify-web/js-beautify/issues/1374))
* CSS selector issue (header > div[class~="div-all"]) in SCSS file ([#1373](https://github.com/beautify-web/js-beautify/issues/1373))
* Add "Create Issue for Unexpected Output" button to website ([#1371](https://github.com/beautify-web/js-beautify/issues/1371))
* Add combobox to control type of beautification ([#1370](https://github.com/beautify-web/js-beautify/issues/1370))
* Add Options textbox to website for debugging ([#1369](https://github.com/beautify-web/js-beautify/issues/1369))


## v1.7.5

### Description


### Closed Issues
* Strict mode: js_source_text is not defined [CSS] ([#1286](https://github.com/beautify-web/js-beautify/issues/1286))
* Made brace_style option more inclusive ([#1277](https://github.com/beautify-web/js-beautify/pull/1277))
* White space before"!important" tag missing in CSS beautify ([#1273](https://github.com/beautify-web/js-beautify/issues/1273))


## v1.7.4

### Description
Thanks @cejast for contributing!

### Closed Issues
* Whitespace after ES7 `async` keyword for arrow functions ([#896](https://github.com/beautify-web/js-beautify/issues/896))


## v1.7.3

### Description
* Fixed broken installs

Lessons learned:
* Don't publish and go to bed.
* I thought I had sufficient test coverage and I did not. Tests will be implemented to protect against this before the next release (#1254).
* Also, this break highlights the need to create a beta channel for releases and a way to request feedback on beta releases (#1255).
* The project has been maintained by mostly one person over the past year or so, with some additions by other individuals. This break also highlights the need for this project to have a few more people who have the ability address issues/emergencies (#1256).
* Many projects do not not lock or even limit their version dependencies.  Those that do often use `^x.x.x` instead of `~x.x.x`.  Consider switching to making major version updates under more circumstances to limit risk to dependent projects.  (#1257)


### Closed Issues
* Version 1.7.0 fail to install through pip ([#1250](https://github.com/beautify-web/js-beautify/issues/1250))
* Installing js-beautify fails ([#1247](https://github.com/beautify-web/js-beautify/issues/1247))


## v1.7.0

### Description


### Closed Issues
* undindent-chained-methods option. Resolves #482 ([#1240](https://github.com/beautify-web/js-beautify/pull/1240))
* Add test and tools folder to npmignore ([#1239](https://github.com/beautify-web/js-beautify/issues/1239))
* incorrect new-line insertion after "yield" ([#1206](https://github.com/beautify-web/js-beautify/issues/1206))
* Do not modify built-in objects ([#1205](https://github.com/beautify-web/js-beautify/issues/1205))
* Fix label checking incorrect box when clicked ([#1169](https://github.com/beautify-web/js-beautify/pull/1169))
* Webpack ([#1149](https://github.com/beautify-web/js-beautify/pull/1149))
* daisy-chain indentation leads to over-indentation ([#482](https://github.com/beautify-web/js-beautify/issues/482))


## v1.6.12

### Description


### Closed Issues
* CSS: Preserve Newlines ([#537](https://github.com/beautify-web/js-beautify/issues/537))


## v1.6.11

### Description
Reverted #1117 - Preserve newlines broken

### Closed Issues
* On beautify, new line before next CSS selector ([#1142](https://github.com/beautify-web/js-beautify/issues/1142))


## v1.6.10

### Description
Added `preserver_newlines` to css beautifier

### Closed Issues


## v1.6.9

### Description
* Fixed html formatting issue with attribute wrap (Thanks, @HookyQR!)
* Fixed python package publishing


### Closed Issues
* Wrong HTML beautification starting with v1.6.5 ([#1115](https://github.com/beautify-web/js-beautify/issues/1115))
* Ignore linebreak when meet handlebar ([#1104](https://github.com/beautify-web/js-beautify/pull/1104))
* Lines are not un-indented correctly when attributes are wrapped ([#1103](https://github.com/beautify-web/js-beautify/issues/1103))
* force-aligned is not aligned when indenting with tabs ([#1102](https://github.com/beautify-web/js-beautify/issues/1102))
* Python package fails to publish  ([#1101](https://github.com/beautify-web/js-beautify/issues/1101))
* Explaination of 'operator_position' is absent from README.md ([#1047](https://github.com/beautify-web/js-beautify/issues/1047))


## v1.6.8

### Description
* Fixed a batch of comment and semicolon-less code bugs


### Closed Issues
* Incorrect indentation after loop with comment ([#1090](https://github.com/beautify-web/js-beautify/issues/1090))
* Extra newline is inserted after beautifying code with anonymous function ([#1085](https://github.com/beautify-web/js-beautify/issues/1085))
* end brace with next comment line make bad indent ([#1043](https://github.com/beautify-web/js-beautify/issues/1043))
* Javascript comment in last line doesn't beautify well ([#964](https://github.com/beautify-web/js-beautify/issues/964))
* indent doesn't work with comment (jsdoc) ([#913](https://github.com/beautify-web/js-beautify/issues/913))
* Wrong indentation, when new line between chained methods ([#892](https://github.com/beautify-web/js-beautify/issues/892))
* Comments in a non-semicolon style have extra indent ([#815](https://github.com/beautify-web/js-beautify/issues/815))
* [bug] Incorrect indentation due to commented line(s) following a function call with a function argument. ([#713](https://github.com/beautify-web/js-beautify/issues/713))
* Wrong indent formatting ([#569](https://github.com/beautify-web/js-beautify/issues/569))


## v1.6.7

### Description
Added `content_unformatted` option (Thanks @arai-a)

### Closed Issues
* HTML pre code indentation ([#928](https://github.com/beautify-web/js-beautify/issues/928))
* Beautify script/style tags but ignore their inner JS/CSS content ([#906](https://github.com/beautify-web/js-beautify/issues/906))


## v1.6.6

### Description
* Added support for editorconfig from stdin
* Added js-beautify to cdnjs
* Fixed CRLF to LF for HTML and CSS on windows
* Added inheritance/overriding to config format (Thanks @DaniGuardiola and @HookyQR)
* Added `force-align` to `wrap-attributes` (Thanks @Lukinos)
* Added `force-expand-multiline` to `wrap-attributes` (Thanks @tobias-zucali)
* Added `preserve-inline` as independent brace setting (Thanks @Coburn37)
* Fixed handlebars with angle-braces (Thanks @mmsqe)



### Closed Issues
* Wrong indentation for comment after nested unbraced control constructs ([#1079](https://github.com/beautify-web/js-beautify/issues/1079))
* Should prefer breaking the line after operator ? instead of before operator < ([#1073](https://github.com/beautify-web/js-beautify/issues/1073))
* New option "force-expand-multiline" for "wrap_attributes" ([#1070](https://github.com/beautify-web/js-beautify/pull/1070))
* Breaks if html file starts with comment ([#1068](https://github.com/beautify-web/js-beautify/issues/1068))
* collapse-preserve-inline restricts users to collapse brace_style ([#1057](https://github.com/beautify-web/js-beautify/issues/1057))
* Parsing failure on numbers with "e" ([#1054](https://github.com/beautify-web/js-beautify/issues/1054))
* Issue with Browser Instructions ([#1053](https://github.com/beautify-web/js-beautify/issues/1053))
* Add preserve inline function for expand style braces ([#1052](https://github.com/beautify-web/js-beautify/issues/1052))
* Update years in LICENSE ([#1038](https://github.com/beautify-web/js-beautify/issues/1038))
* JS. Switch with template literals. Unexpected indentation. ([#1030](https://github.com/beautify-web/js-beautify/issues/1030))
* The object with spread object formatted not correctly ([#1023](https://github.com/beautify-web/js-beautify/issues/1023))
* Bad output generator function in class ([#1013](https://github.com/beautify-web/js-beautify/issues/1013))
* Support editorconfig for stdin ([#1012](https://github.com/beautify-web/js-beautify/issues/1012))
* Publish to cdnjs ([#992](https://github.com/beautify-web/js-beautify/issues/992))
* breaks if handlebars comments contain handlebars tags ([#930](https://github.com/beautify-web/js-beautify/issues/930))
* Using jsbeautifyrc is broken ([#929](https://github.com/beautify-web/js-beautify/issues/929))
* Option to put HTML attributes on their own lines, aligned ([#916](https://github.com/beautify-web/js-beautify/issues/916))
* Erroneously changes CRLF to LF on Windows in HTML and CSS ([#899](https://github.com/beautify-web/js-beautify/issues/899))
* Weird space in {get } vs { normal } ([#888](https://github.com/beautify-web/js-beautify/issues/888))
* Bad for-of formatting with constant Array ([#875](https://github.com/beautify-web/js-beautify/issues/875))
* Problems with filter property in css and scss ([#755](https://github.com/beautify-web/js-beautify/issues/755))
* Add "collapse-one-line" option for non-collapse brace styles  ([#487](https://github.com/beautify-web/js-beautify/issues/487))


## v1.6.4

### Description
* Fixed JSX multi-line root element handling 
* Fixed CSS Combinator spacing (NOTE: use `space_around_combinator` option)
* Fixed (more) CSS pseudo-class and pseudo-element selectors (Thanks @Konamiman!)
* Fixed Shorthand generator functions and `yield*` (Thanks @jgeurts!)
* Added EditorConfig support (Thanks @ethanluoyc!)
* Added indent_body_inner_html and indent_head_inner_html (Thanks @spontaliku-softaria!)
* Added js-beautify to https://cdn.rawgit.com (Thanks @zxqfox)





### Closed Issues
* css-beautify sibling combinator space issue ([#1001](https://github.com/beautify-web/js-beautify/issues/1001))
* Bug: Breaks when the source code it found an unclosed multiline comment. ([#996](https://github.com/beautify-web/js-beautify/issues/996))
* CSS: Preserve white space before pseudo-class and pseudo-element selectors ([#985](https://github.com/beautify-web/js-beautify/pull/985))
* Spelling error in token definition ([#984](https://github.com/beautify-web/js-beautify/issues/984))
* collapse-preserve-inline does not preserve simple, single line ("return") statements ([#982](https://github.com/beautify-web/js-beautify/issues/982))
* Publish the library via cdn ([#971](https://github.com/beautify-web/js-beautify/issues/971))
* Bug with css calc() function ([#957](https://github.com/beautify-web/js-beautify/issues/957))
* &:first-of-type:not(:last-child) when prettified insert erroneous white character ([#952](https://github.com/beautify-web/js-beautify/issues/952))
* Shorthand generator functions are formatting strangely ([#941](https://github.com/beautify-web/js-beautify/issues/941))
* Add handlebars support on cli for html ([#935](https://github.com/beautify-web/js-beautify/pull/935))
* Do not put a space within `yield*` generator functions. ([#920](https://github.com/beautify-web/js-beautify/issues/920))
* Possible to add an indent_inner_inner_html option? (Prevent indenting second-level tags) ([#917](https://github.com/beautify-web/js-beautify/issues/917))
* Messing up jsx formatting ([#914](https://github.com/beautify-web/js-beautify/issues/914))
* Bug report: Closing 'body' tag isn't formatted correctly ([#900](https://github.com/beautify-web/js-beautify/issues/900))
* { throw … } not working with collapse-preserve-inline ([#898](https://github.com/beautify-web/js-beautify/issues/898))
* ES6 concise method not propely indented ([#889](https://github.com/beautify-web/js-beautify/issues/889))
* CSS beautify changing symantics ([#883](https://github.com/beautify-web/js-beautify/issues/883))
* Dojo unsupported script types. ([#874](https://github.com/beautify-web/js-beautify/issues/874))
* Readme version comment  ([#868](https://github.com/beautify-web/js-beautify/issues/868))
* Extra space after pseudo-elements within :not() ([#618](https://github.com/beautify-web/js-beautify/issues/618))
* space in media queries after colon &: selectors ([#565](https://github.com/beautify-web/js-beautify/issues/565))
* Integrating editor config ([#551](https://github.com/beautify-web/js-beautify/issues/551))
* Preserve short expressions/statements on single line ([#338](https://github.com/beautify-web/js-beautify/issues/338))


## v1.6.3

### Description
Bug fixes

### Closed Issues
* CLI broken when output path is not set ([#933](https://github.com/beautify-web/js-beautify/issues/933))
* huge memory leak ([#909](https://github.com/beautify-web/js-beautify/issues/909))
* don't print unpacking errors on stdout (python) ([#884](https://github.com/beautify-web/js-beautify/pull/884))
* Fix incomplete list of non-positionable operators (python lib) ([#878](https://github.com/beautify-web/js-beautify/pull/878))
* Fix Issue #844 ([#873](https://github.com/beautify-web/js-beautify/pull/873))
* assignment exponentiation operator ([#864](https://github.com/beautify-web/js-beautify/issues/864))
* Bug in Less mixins ([#844](https://github.com/beautify-web/js-beautify/issues/844))
* Can't Nest Conditionals ([#680](https://github.com/beautify-web/js-beautify/issues/680))
* ternary operations ([#670](https://github.com/beautify-web/js-beautify/issues/670))
* Support newline before logical or ternary operator ([#605](https://github.com/beautify-web/js-beautify/issues/605))
* Provide config files for format and linting ([#336](https://github.com/beautify-web/js-beautify/issues/336))


## v1.6.2

### Description


### Closed Issues
* Add missing 'collapse-preserve-inline' option to js module ([#861](https://github.com/beautify-web/js-beautify/pull/861))


## v1.6.1

### Description
Fixes for regressions found in 1.6.0


### Closed Issues
* Inconsistent formatting for arrays of objects ([#860](https://github.com/beautify-web/js-beautify/issues/860))
* Publish v1.6.1 ([#859](https://github.com/beautify-web/js-beautify/issues/859))
* Space added to "from++" due to ES6 keyword  ([#858](https://github.com/beautify-web/js-beautify/issues/858))
* Changelog generator doesn't sort versions above 9 right ([#778](https://github.com/beautify-web/js-beautify/issues/778))
* space-after-anon-function not applied to object properties ([#761](https://github.com/beautify-web/js-beautify/issues/761))
* Separating 'input' elements adds whitespace ([#580](https://github.com/beautify-web/js-beautify/issues/580))
* Inline Format ([#572](https://github.com/beautify-web/js-beautify/issues/572))
* Preserve attributes line break in HTML ([#455](https://github.com/beautify-web/js-beautify/issues/455))
* Multiline Array ([#406](https://github.com/beautify-web/js-beautify/issues/406))


## v1.6.0

### Description
* Inline/short object and json preservation (all rejoice!)
* ES6 annotations, module import/export, arrow functions, concise methods, and more
* JSX spread attributes
* HTML wrap attributes, inline element fixes, doctype and php fixes
* Test framework hardening
* Windows build fixed and covered by appveyor continuous integration



### Closed Issues
* Individual tests pollute options object ([#855](https://github.com/beautify-web/js-beautify/issues/855))
* Object attribute assigned fat arrow function with implicit return of a ternary causes next line to indent ([#854](https://github.com/beautify-web/js-beautify/issues/854))
* Treat php tags as single in html ([#850](https://github.com/beautify-web/js-beautify/pull/850))
* Read piped input by default ([#849](https://github.com/beautify-web/js-beautify/pull/849))
* Replace makefile dependency with bash script ([#848](https://github.com/beautify-web/js-beautify/pull/848))
* list of HTML inline elements incomplete; wraps inappropriately ([#840](https://github.com/beautify-web/js-beautify/issues/840))
* Beautifying bracket-less if/elses ([#838](https://github.com/beautify-web/js-beautify/issues/838))
* <col> elements within a <colgroup> are getting indented incorrectly ([#836](https://github.com/beautify-web/js-beautify/issues/836))
* single attribute breaks jsx beautification ([#834](https://github.com/beautify-web/js-beautify/issues/834))
* Improve Python packaging ([#831](https://github.com/beautify-web/js-beautify/pull/831))
* Erroneously changes CRLF to LF on Windows. ([#829](https://github.com/beautify-web/js-beautify/issues/829))
* Can't deal with XHTML5 ([#828](https://github.com/beautify-web/js-beautify/issues/828))
* HTML after PHP is indented ([#826](https://github.com/beautify-web/js-beautify/issues/826))
* exponentiation operator ([#825](https://github.com/beautify-web/js-beautify/issues/825))
* Add support for script type "application/ld+json" ([#821](https://github.com/beautify-web/js-beautify/issues/821))
* package.json: Remove "preferGlobal" option ([#820](https://github.com/beautify-web/js-beautify/pull/820))
* Don't use array.indexOf() to support legacy browsers ([#816](https://github.com/beautify-web/js-beautify/pull/816))
* ES6 Object Shortand Indenting Weirdly Sometimes ([#810](https://github.com/beautify-web/js-beautify/issues/810))
* Implicit Return Function on New Line not Preserved ([#806](https://github.com/beautify-web/js-beautify/issues/806))
* Misformating "0b" Binary Strings ([#803](https://github.com/beautify-web/js-beautify/issues/803))
* Beautifier breaks ES6 nested template strings ([#797](https://github.com/beautify-web/js-beautify/issues/797))
* Misformating "0o" Octal Strings ([#792](https://github.com/beautify-web/js-beautify/issues/792))
* Do not use hardcoded directory for tests ([#788](https://github.com/beautify-web/js-beautify/pull/788))
* Handlebars {{else}} tag not given a newline ([#784](https://github.com/beautify-web/js-beautify/issues/784))
* Wrong indentation for XML header (<?xml version="1.0"?>) ([#783](https://github.com/beautify-web/js-beautify/issues/783))
* is_whitespace for loop incrementing wrong variable ([#777](https://github.com/beautify-web/js-beautify/pull/777))
* Newline is inserted after comment with comma_first ([#775](https://github.com/beautify-web/js-beautify/issues/775))
* Cannot copy more than 1000 characters out of CodeMirror buffer ([#768](https://github.com/beautify-web/js-beautify/issues/768))
* Missing 'var' in beautify-html.js; breaks strict mode ([#763](https://github.com/beautify-web/js-beautify/issues/763))
* Fix typo in the example javascript code of index.html ([#753](https://github.com/beautify-web/js-beautify/pull/753))


## v1.5.10

### Description
Hotfix for directives
Version jump due to release script tweaks


### Closed Issues
* Preserve directive doesn't work as intended ([#723](https://github.com/beautify-web/js-beautify/issues/723))


## v1.5.7

### Description
* Beautifier does not break PHP and Underscore.js templates
* Fix for SCSS pseudo classes and intperpolation/mixins
* Alternative Newline Characters in CSS and HTML
* Preserve formatting or completely ignore section of javascript using comments


### Closed Issues
* Support for legacy JavaScript versions (e.g. WSH+JScript & Co) ([#720](https://github.com/beautify-web/js-beautify/pull/720))
* Is \\n hard coded into CSS Beautifier logic? ([#715](https://github.com/beautify-web/js-beautify/issues/715))
* Spaces and linebreaks after # and around { } messing up interpolation/mixins (SASS/SCSS) ([#689](https://github.com/beautify-web/js-beautify/issues/689))
* Calls to functions get completely messed up in Sass (*.scss) ([#675](https://github.com/beautify-web/js-beautify/issues/675))
* No new line after selector in scss files ([#666](https://github.com/beautify-web/js-beautify/issues/666))
* using html-beautify on handlebars template deletes unclosed tag if on second line ([#623](https://github.com/beautify-web/js-beautify/issues/623))
* more Extra space after scss pseudo classes ([#557](https://github.com/beautify-web/js-beautify/issues/557))
* Unnecessary spaces in PHP code ([#490](https://github.com/beautify-web/js-beautify/issues/490))
* Some underscore.js template tags are broken ([#417](https://github.com/beautify-web/js-beautify/issues/417))
* Selective ignore using comments (feature request) ([#384](https://github.com/beautify-web/js-beautify/issues/384))


## v1.5.6

### Description
* JSX support!
* Alternative Newline Characters
* CSS and JS comment formatting fixes 
* General bug fixing


### Closed Issues
* Fix tokenizer's bracket pairs' open stack ([#693](https://github.com/beautify-web/js-beautify/pull/693))
* Indentation is incorrect for HTML5 void tag <source> ([#692](https://github.com/beautify-web/js-beautify/issues/692))
* Line wrapping breaks at the wrong place when the line is indented. ([#691](https://github.com/beautify-web/js-beautify/issues/691))
* Publish v1.5.6 ([#687](https://github.com/beautify-web/js-beautify/issues/687))
* Replace existing file fails using python beautifier ([#686](https://github.com/beautify-web/js-beautify/issues/686))
* Pseudo-classes formatted incorrectly and inconsistently with @page ([#661](https://github.com/beautify-web/js-beautify/issues/661))
* doc: add end_with_newline option ([#650](https://github.com/beautify-web/js-beautify/pull/650))
* Improve support for xml parts of jsx (React) => spaces, spread attributes and nested objects break the process ([#646](https://github.com/beautify-web/js-beautify/issues/646))
* html-beautify formats handlebars comments but does not format html comments ([#635](https://github.com/beautify-web/js-beautify/issues/635))
* Support for ES7 async ([#630](https://github.com/beautify-web/js-beautify/issues/630))
* css beautify adding an extra newline after a comment line in a css block ([#609](https://github.com/beautify-web/js-beautify/issues/609))
* No option to "Indent with tabs" for HTML files ([#587](https://github.com/beautify-web/js-beautify/issues/587))
* Function body is indented when followed by a comment ([#583](https://github.com/beautify-web/js-beautify/issues/583))
* JSX support ([#425](https://github.com/beautify-web/js-beautify/issues/425))
* Alternative Newline Characters ([#260](https://github.com/beautify-web/js-beautify/issues/260))


## v1.5.5

### Description
* Initial implementation of comma-first formatting - Diff-friendly literals!
* CSS: Add newline between rules
* LESS: improved function parameter formatting
* HTML: options for wrapping attributes
* General bug fixing

### Closed Issues
* Add GUI support for `--indent-inner-html`. ([#633](https://github.com/beautify-web/js-beautify/pull/633))
* Publish v1.5.5 ([#629](https://github.com/beautify-web/js-beautify/issues/629))
* CSS: Updating the documentation for the 'newline_between_rules' ([#615](https://github.com/beautify-web/js-beautify/pull/615))
* Equal Sign Removed from Filter Properties Alpha Opacity Assignment ([#599](https://github.com/beautify-web/js-beautify/issues/599))
* Keep trailing spaces on comments ([#598](https://github.com/beautify-web/js-beautify/issues/598))
* only print the file names of changed files ([#597](https://github.com/beautify-web/js-beautify/issues/597))
*  CSS: support add newline between rules ([#574](https://github.com/beautify-web/js-beautify/pull/574))
* elem[array]++ changes to elem[array] ++ inserting unnecessary gap ([#570](https://github.com/beautify-web/js-beautify/issues/570))
* add support to less functions paramters braces ([#568](https://github.com/beautify-web/js-beautify/pull/568))
* selector_separator_newline: true for Sass doesn't work ([#563](https://github.com/beautify-web/js-beautify/issues/563))
* yield statements are being beautified to their own newlines since 1.5.2 ([#560](https://github.com/beautify-web/js-beautify/issues/560))
* HTML beautifier inserts extra newline into `<li>`s ending with `<code>` ([#524](https://github.com/beautify-web/js-beautify/issues/524))
* Add wrap_attributes option ([#476](https://github.com/beautify-web/js-beautify/issues/476))
* Add or preserve empty line between CSS rules ([#467](https://github.com/beautify-web/js-beautify/issues/467))
* Support comma first style of variable declaration ([#245](https://github.com/beautify-web/js-beautify/issues/245))


## v1.5.4

### Description
* Fix for LESS/CSS pseudo/classes
* Fix for HTML img tag spaces

https://github.com/beautify-web/js-beautify/compare/v1.5.3...v1.5.4

### Closed Issues
* TypeScript oddly formatted with 1.5.3 ([#552](https://github.com/beautify-web/js-beautify/issues/552))
* HTML beautifier inserts double spaces between adjacent tags ([#525](https://github.com/beautify-web/js-beautify/issues/525))
* Keep space in font rule ([#491](https://github.com/beautify-web/js-beautify/issues/491))
* [Brackets plug in] Space after </a> disappears ([#454](https://github.com/beautify-web/js-beautify/issues/454))
* Support nested pseudo-classes and parent reference (LESS) ([#427](https://github.com/beautify-web/js-beautify/pull/427))
* Alternate approach: preserve single spacing and treat img as inline element ([#415](https://github.com/beautify-web/js-beautify/pull/415))


## v1.5.3

### Description
* High priority bug fixes
* Major fixes to css-beautifier to not blow up LESS/SCSS
* Lower priority bug fixes that were very ugly

https://github.com/beautify-web/js-beautify/compare/v1.5.2...v1.5.3

### Closed Issues
* [TypeError: Cannot read property 'type' of undefined] ([#548](https://github.com/beautify-web/js-beautify/issues/548))
* Bug with RegExp ([#547](https://github.com/beautify-web/js-beautify/issues/547))
* Odd behaviour on less ([#520](https://github.com/beautify-web/js-beautify/issues/520))
* css beauitify ([#506](https://github.com/beautify-web/js-beautify/issues/506))
* Extra space after scss pseudo classes. ([#500](https://github.com/beautify-web/js-beautify/issues/500))
* Generates invalid scss when formatting ampersand selectors ([#498](https://github.com/beautify-web/js-beautify/issues/498))
* bad formatting of .less files using @variable or &:hover syntax ([#489](https://github.com/beautify-web/js-beautify/issues/489))
* Incorrect beautifying of CSS comment including an url. ([#466](https://github.com/beautify-web/js-beautify/issues/466))
* Handle SASS parent reference &: ([#414](https://github.com/beautify-web/js-beautify/issues/414))
* Js-beautify breaking selectors in less code.  ([#410](https://github.com/beautify-web/js-beautify/issues/410))
* Problem with "content" ([#364](https://github.com/beautify-web/js-beautify/issues/364))
* Space gets inserted between function and paren for function in Define  ([#313](https://github.com/beautify-web/js-beautify/issues/313))
* beautify-html returns null on broken html ([#301](https://github.com/beautify-web/js-beautify/issues/301))
* Indentation of functions inside conditionals not passing jslint ([#298](https://github.com/beautify-web/js-beautify/issues/298))


## v1.5.2

### Description
* Improved indenting for statements, array, variable declaration, "Starless" block-comments
* Support for bitwise-not, yield, get, set, let, const, generator functions
* Reserved words can be used as object property names
* Added options: space_after_anon_function, end-with-newline
* Properly tokenize Numbers (including decimals and exponents)
* Do not break "x++ + y"
* function declaration inside array behaves the same as in expression
* Close String literals at newline
* Support handlebar syntax 
* Check `<script>` "type"-attribute
* Allow `<style>` and `<script>` tags to be unformatted
* Port css nesting fix to python
* Fix python six dependency
* Initial very cursory support for ES6 module, export, and import 

https://github.com/beautify-web/js-beautify/compare/v1.5.1...v1.5.2

### Closed Issues
* Allow custom elements to be unformatted ([#540](https://github.com/beautify-web/js-beautify/pull/540))
* Need option to ignore brace style ([#538](https://github.com/beautify-web/js-beautify/issues/538))
* Refactor to Output and OutputLine classes ([#536](https://github.com/beautify-web/js-beautify/pull/536))
* Recognize ObjectLiteral on open brace ([#535](https://github.com/beautify-web/js-beautify/pull/535))
* Refactor to fully tokenize before formatting ([#530](https://github.com/beautify-web/js-beautify/pull/530))
* Cleanup checked in six.py file ([#527](https://github.com/beautify-web/js-beautify/pull/527))
* Changelog.md? ([#526](https://github.com/beautify-web/js-beautify/issues/526))
* New line added between each css declaration ([#523](https://github.com/beautify-web/js-beautify/issues/523))
* Kendo Template scripts get messed up! ([#516](https://github.com/beautify-web/js-beautify/issues/516))
* SyntaxError: Unexpected token ++ ([#514](https://github.com/beautify-web/js-beautify/issues/514))
* space appears before open square bracket when the object name is "set" ([#508](https://github.com/beautify-web/js-beautify/issues/508))
* Unclosed string problem ([#505](https://github.com/beautify-web/js-beautify/issues/505))
* "--n" and "++n" are not indented like "n--" and "n++" are... ([#495](https://github.com/beautify-web/js-beautify/issues/495))
* Allow `<style>` and `<script>` tags to be unformatted ([#494](https://github.com/beautify-web/js-beautify/pull/494))
* Preserve new line at end of file ([#492](https://github.com/beautify-web/js-beautify/issues/492))
* Line wraps breaking numbers (causes syntax error) ([#488](https://github.com/beautify-web/js-beautify/issues/488))
* jsBeautify acts differently when handling different kinds of function expressions ([#485](https://github.com/beautify-web/js-beautify/issues/485))
* AttributeError: 'NoneType' object has no attribute 'groups' ([#479](https://github.com/beautify-web/js-beautify/issues/479))
* installation doco for python need update -- pip install six? ([#478](https://github.com/beautify-web/js-beautify/issues/478))
* Move einars/js-beautify to beautify-web/js-beautify ([#475](https://github.com/beautify-web/js-beautify/issues/475))
* Bring back space_after_anon_function ([#474](https://github.com/beautify-web/js-beautify/pull/474))
* fix for #453, Incompatible handlebar syntax ([#468](https://github.com/beautify-web/js-beautify/pull/468))
* Python: missing explicit dependency on "six" package ([#465](https://github.com/beautify-web/js-beautify/issues/465))
* function declaration inside array, adds extra line.  ([#464](https://github.com/beautify-web/js-beautify/issues/464))
* [es6] yield a array ([#458](https://github.com/beautify-web/js-beautify/issues/458))
* Publish v1.5.2 ([#452](https://github.com/beautify-web/js-beautify/issues/452))
* Port css colon character fix to python  ([#446](https://github.com/beautify-web/js-beautify/issues/446))
* Cannot declare object literal properties with unquoted reserved words ([#440](https://github.com/beautify-web/js-beautify/issues/440))
* Do not put a space within `function*` generator functions. ([#428](https://github.com/beautify-web/js-beautify/issues/428))
* beautification of "nth-child" css fails csslint ([#418](https://github.com/beautify-web/js-beautify/issues/418))


## v1.5.1

### Description
Highlights:
* Fixes var declaration of objects and arrays to indent correctly (#256, #430)
* Support keywords as IdentifierNames such as foo.catch() (#309, #351,#368, #378)
* Improved indenting for statements (#289)
* Improved ES6 support - let, const, template strings, and "fat arrow"
* Support for non-ASCII characters in variable names (#305)
* Multiple fixes to requirejs support and added tests to protect in future
* Improved LESS support (still plenty of room for improvement in this area)
* Do not add space after !!

https://github.com/einars/js-beautify/compare/v1.4.2...v1.5.1

### Closed Issues
* Nested if statements not displayed correctly ([#450](https://github.com/beautify-web/js-beautify/issues/450))
* preserve_newlines always true ([#449](https://github.com/beautify-web/js-beautify/issues/449))
* line wrapping breaks in weird places ([#438](https://github.com/beautify-web/js-beautify/issues/438))
* Update dependencies to current versions ([#437](https://github.com/beautify-web/js-beautify/pull/437))
* Add support for ES6 template strings ([#434](https://github.com/beautify-web/js-beautify/pull/434))
* Fix #402: support ES6 fat arrow ([#433](https://github.com/beautify-web/js-beautify/pull/433))
* Ending brace missaligned when part of first definition in var line ([#430](https://github.com/beautify-web/js-beautify/issues/430))
* fixing disabled line wrapping for HTML ([#429](https://github.com/beautify-web/js-beautify/pull/429))
* Missing semi colon ([#420](https://github.com/beautify-web/js-beautify/issues/420))
* Fixed require.js support ([#416](https://github.com/beautify-web/js-beautify/pull/416))
* should not split the es6 operator '=>' ([#402](https://github.com/beautify-web/js-beautify/issues/402))
* fixed relative paths for require.js ([#387](https://github.com/beautify-web/js-beautify/pull/387))
* Support reserved words as property names ([#378](https://github.com/beautify-web/js-beautify/issues/378))
* Make the AMD API match the rest of the APIs ([#376](https://github.com/beautify-web/js-beautify/pull/376))
* Preserve newlines in html related to issue #307 ([#375](https://github.com/beautify-web/js-beautify/pull/375))
* Multi-line statements ([#374](https://github.com/beautify-web/js-beautify/issues/374))
* Reserved words used as property/function/variable identifiers are formatted incorrectly ([#368](https://github.com/beautify-web/js-beautify/issues/368))
* fixed problems with colon character ([#363](https://github.com/beautify-web/js-beautify/pull/363))
* require.JS paths are hardcoded in beautify-html.js  ([#359](https://github.com/beautify-web/js-beautify/issues/359))
* Regression in p.a.c.ked file detection ([#357](https://github.com/beautify-web/js-beautify/issues/357))
* Fix Issue #339 ([#354](https://github.com/beautify-web/js-beautify/pull/354))
* Added single line comment support in less/sass for javascript parser ([#353](https://github.com/beautify-web/js-beautify/pull/353))
* Function named 'in' not formatting correctly ([#351](https://github.com/beautify-web/js-beautify/issues/351))
* CSS Pseudo element ([#346](https://github.com/beautify-web/js-beautify/issues/346))
* array closing brace error for return statements with keep_array_indentation ([#340](https://github.com/beautify-web/js-beautify/issues/340))
* CSS Beautifier: breaks :before and :after (regression) ([#339](https://github.com/beautify-web/js-beautify/issues/339))
* Publish v1.5.0  ([#335](https://github.com/beautify-web/js-beautify/issues/335))
* "keep array indentation" not working ([#333](https://github.com/beautify-web/js-beautify/issues/333))
* CSS Beautifier: support LESS/SASS line comments ([#326](https://github.com/beautify-web/js-beautify/issues/326))
* Incorrect formating with semicolon-less code ([#323](https://github.com/beautify-web/js-beautify/issues/323))


