export interface WarningStructure {
  name?: string | null;
  message: string;
  fileName?: string | null;
  lineNumber: number;
  columnNumber: number;
  source?: string;
  severity?: 'notice' | 'warning';
}

interface Params {
  message: string;
  columnNumber: number;
  lineNumber: number;
  fileName?: string | null;
  name?: string | null;
}

export function buildWorkerWarning(
  { message, columnNumber, lineNumber, fileName, name }: Params,
  source?: string | null
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
