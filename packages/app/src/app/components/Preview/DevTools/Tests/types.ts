export type Message = {
  type: 'message' | 'command' | 'return',
  logType: 'log' | 'warn' | 'info' | 'error',
  arguments: any[],
};

export type Status = 'idle' | 'running' | 'pass' | 'fail';

export type TestError = Error & {
  matcherResult?: boolean,
  mappedErrors?: Array<{
    fileName: string,
    _originalFunctionName: string,
    _originalColumnNumber: number,
    _originalLineNumber: number,
    _originalScriptCode: Array<{
      lineNumber: number,
      content: string,
      highlight: boolean,
    }>,
  }>,
};

export type Test = {
  testName: Array<string>,
  duration?: number,
  status: Status,
  errors: Array<TestError>,
  running: boolean,
  path: string,
};

export type File = {
  fileName: string,
  fileError?: TestError,
  tests: {
    [testName: string]: Test,
  },
};
