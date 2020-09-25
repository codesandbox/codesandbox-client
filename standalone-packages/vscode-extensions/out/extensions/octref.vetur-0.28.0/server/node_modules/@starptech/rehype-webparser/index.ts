import { HtmlParser, ParseErrorLevel, TreeError } from '@starptech/webparser'
import fromWebparser from '@starptech/hast-util-from-webparser'

interface ParseOptions {
  ignoreFirstLf?: boolean
  decodeEntities?: boolean
  selfClosingCustomElements?: boolean
}
interface VFile {
  path: string
  message(reason: string, position: any, origin: string): void
  fail(reason: string, position: any, origin: string): void
}

export = function parse(options: ParseOptions = {}): any {
  this.Parser = parser

  function parser(doc: string, file: VFile) {
    const parseResult = new HtmlParser(options).parse(doc, file.path)
    const lexerErrors = parseResult.errors.filter(e => !(e instanceof TreeError))
    const parserErrors = parseResult.errors.filter(e => e instanceof TreeError)
    const parserWarnings = parserErrors.filter(e => e.level === ParseErrorLevel.WARNING)

    for (const err of parserWarnings) {
      file.message(
        err.msg,
        {
          start: {
            // webparser format counts lines beginning from zero
            line: ++err.span.start.line,
            offset: err.span.start.offset,
            column: err.span.start.col
          },
          end: {
            line: ++err.span.end.line,
            offset: err.span.end.offset,
            column: err.span.end.col
          }
        },
        'ParseError'
      )
    }

    // log the first error which is related to the parser not lexer
    const parserFatalErrors = parserErrors.filter(e => e.level === ParseErrorLevel.ERROR)

    for (const err of parserFatalErrors) {
      file.fail(
        err.msg,
        {
          start: {
            // webparser format counts lines beginning from zero
            line: ++err.span.start.line,
            offset: err.span.start.offset,
            column: err.span.start.col
          },
          end: {
            line: ++err.span.end.line,
            offset: err.span.end.offset,
            column: err.span.end.col
          }
        },
        'ParseError'
      )
    }

    // when lexer error don't produce a parser error we still need to fail with the lexer error
    if (parserFatalErrors.length === 0 && lexerErrors.length > 0) {
      const err = lexerErrors[0]
      file.fail(
        err.msg,
        {
          start: {
            // webparser format counts lines beginning from zero
            line: ++err.span.start.line,
            offset: err.span.start.offset,
            column: err.span.start.col
          },
          end: {
            line: ++err.span.end.line,
            offset: err.span.end.offset,
            column: err.span.end.col
          }
        },
        'LexerError'
      )
    }

    return fromWebparser(parseResult.rootNodes, options)
  }
}
