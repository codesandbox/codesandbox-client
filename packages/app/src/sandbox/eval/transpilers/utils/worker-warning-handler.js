// @flow

export type WarningStructure = {
  name: ?string,
  message: string,
  fileName: ?string,
  lineNumber: number,
  columnNumber: number,
  source: ?string,
  severity?: 'notice' | 'warning',
};

type Params = {
  message: string,
  columnNumber: number,
  lineNumber: number,
  fileName: ?string,
  name: ?string,
};

export function buildWorkerWarning(
  { message, columnNumber, lineNumber, fileName, name }: Params,
  source: ?string
): WarningStructure {
  return {
    message,
    columnNumber,
    lineNumber,
    fileName,
    name,
    source,
  };
}
