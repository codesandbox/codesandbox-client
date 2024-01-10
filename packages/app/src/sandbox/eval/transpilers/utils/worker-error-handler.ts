interface WorkerError {
  name: string;
  message: string;
  fileName?: string | null;
  lineNumber?: number | null;
  columnNumber?: number | null;
}

interface ExtendedError extends Error {
  fileName?: string | null;
  lineNumber?: number | null;
  columnNumber?: number | null;
}

export function buildWorkerError(error: ExtendedError): WorkerError {
  return {
    name: error.name,
    message: error.message,
    fileName: error.fileName,
    lineNumber: error.lineNumber,
    columnNumber: error.columnNumber,
  };
}

export function parseWorkerError(error: WorkerError): ExtendedError {
  const reconstructedError: ExtendedError = new Error(error.message);
  reconstructedError.name = error.name;
  reconstructedError.columnNumber = error.columnNumber;
  reconstructedError.fileName = error.fileName;
  reconstructedError.lineNumber = error.lineNumber;

  return reconstructedError;
}
