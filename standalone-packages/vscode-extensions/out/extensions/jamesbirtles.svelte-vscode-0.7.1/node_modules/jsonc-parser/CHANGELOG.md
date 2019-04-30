
1.0.3 2018-03-07
==================
 - provide ems modules

1.0.2 2018-03-05
==================
 - added the *visit.onComment* API, reported when comments are allowed.
 - added the *ParseErrorCode.InvalidCommentToken* enum value, reported when comments are disallowed.

1.0.1
==================
 - added the *format* API: computes edits to format a JSON document.
 - added the *modify* API: computes edits to insert, remove or replace a property or value in a JSON document.
 - added the *allyEdits* API: applies edits to a document

1.0.0
==================
 * remove nls dependency (remove getParseErrorMessage)

0.4.2 / 2017-05-05
==================
 * added ParseError.offset & ParseError.length

0.4.1 / 2017-04-02
==================
 * added ParseOptions.allowTrailingComma

0.4.0 / 2017-02-23
==================
  * fix for `getLocation`. Now `getLocation` inside an object will always return a property from inside that property. Can be empty string if the object has no properties or if the offset is before a actual property  `{ "a": { | }} will return location ['a', ' ']`

0.3.0 / 2017-01-17
==================
  * Updating to typescript 2.0