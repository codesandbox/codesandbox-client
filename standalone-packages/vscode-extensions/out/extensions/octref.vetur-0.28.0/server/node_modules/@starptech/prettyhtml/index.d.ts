declare namespace prettyhtml {}

interface VPoint {
  line: number
  column: number
  offset: number
}

interface VPosition {
  start: VPoint
  end: VPoint
  indent: number
}

interface VMessage extends Error {
  /**
   * Reason for message (string or Error). Uses the stack and message of the error if given.
   */
  reason: string | Error
  /**
   * Starting line of error.
   */
  line: number
  /**
   * Starting column of error.
   */
  column: number
  /**
   * Full range information, when available (Position). Has start and end properties, both set to an object with line and column, set to number?.
   */
  location: { start: VPosition; end: VPosition }
  /**
   * Category of message.
   */
  ruleId: string
  /**
   * If true, marks associated file as no longer processable. If false, necessitates a (potential) change. The value can also be null or undefined.
   */
  fatal: boolean
}

interface VFile {
  /**
   * Path of vfile. Cannot be nullified.
   */
  path: string
  /**
   * Result
   */
  contents: string
  /**
   * Base of path. Defaults to process.cwd().
   */
  cwd: string
  /**
   * Current name (including extension) of vfile. Cannot contain path separators. Cannot be nullified either (use file.path = file.dirname instead).
   */
  basename: string
  /**
   * Name (without extension) of vfile. Cannot be nullified, and cannot contain path separators.
   */
  stem: string
  /**
   * Extension (with dot) of vfile. Cannot be set if there’s no path yet and cannot contain path separators.
   */
  extname: string
  /**
   * Path to parent directory of vfile. Cannot be set if there’s no path yet.
   */
  dirname: string
  /**
   * List of file-paths the file moved between.
   */
  history: string[]
  /**
   * List of messages associated with the file.
   */
  messages: VMessage[]
  /**
   * Place to store custom information. It’s OK to store custom data directly on the vfile, moving it to data gives a little more privacy.
   */
  data: string
}

declare function prettyhtml(
  input: string,
  options?: {
    tabWidth?: number
    useTabs?: boolean
    printWidth?: number
    usePrettier?: boolean
    singleQuote?: boolean
    wrapAttributes?: boolean
    sortAttributes?: boolean
    prettier?: {
      tabWidth?: number
      useTabs?: boolean
      printWidth?: number
      singleQuote?: boolean
    }
  }
): VFile

export = prettyhtml
