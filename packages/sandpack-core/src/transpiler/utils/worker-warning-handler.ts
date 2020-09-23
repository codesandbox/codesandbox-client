export type WarningStructure = {
  name?: string;
  message: string;
  fileName?: string;
  lineNumber?: number;
  columnNumber?: number;
  source?: string;
  severity?: 'notice' | 'warning';
};

type Params = {
  message: string;
  columnNumber: number;
  lineNumber: number;
  fileName: string | undefined;
  name: string | undefined;
};

export function buildWorkerWarning(
  { message, columnNumber, lineNumber, fileName, name }: Params,
  source: string | undefined
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
