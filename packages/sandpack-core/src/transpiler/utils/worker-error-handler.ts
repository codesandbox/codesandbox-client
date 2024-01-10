export class FileError extends Error {
  fileName?: string;
  lineNumber?: number;
  columnNumber?: number;
}

type WorkerError = {
  name: string;
  message: string;
  fileName: string | undefined;
  lineNumber: number | undefined;
  columnNumber: number | undefined;
};

export function buildWorkerError(error: FileError): WorkerError {
  return {
    name: error.name,
    message: error.message,
    fileName: error.fileName,
    lineNumber: error.lineNumber,
    columnNumber: error.columnNumber,
  };
}

export function parseWorkerError(error: WorkerError): FileError {
  const reconstructedError = new FileError(error.message);
  reconstructedError.name = error.name;
  reconstructedError.columnNumber = error.columnNumber;
  reconstructedError.fileName = error.fileName;
  reconstructedError.lineNumber = error.lineNumber;

  return reconstructedError;
}
