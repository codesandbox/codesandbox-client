// @flow

type WorkerError = {
  name: string,
  message: string,
  fileName: ?string,
  lineNumber: ?number,
  columnNumber: ?number,
};

export function buildWorkerError(error: Error): WorkerError {
  return {
    name: error.name,
    message: error.message,
    fileName: error.fileName,
    lineNumber: error.lineNumber,
    columnNumber: error.columnNumber,
  };
}

export function parseWorkerError(error: WorkerError): Error {
  const reconstructedError = new Error(error.message);
  reconstructedError.name = error.name;
  reconstructedError.columnNumber = error.columnNumber;
  reconstructedError.fileName = error.columnNumber;
  reconstructedError.lineNumber = error.lineNumber;

  return reconstructedError;
}
