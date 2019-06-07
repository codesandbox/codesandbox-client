import { GraphQLError } from "graphql";
import path from "path";

// ToolError is used for errors that are part of the expected flow
// and for which a stack trace should not be printed

export class ToolError extends Error {
  name: string = "ToolError";

  constructor(message: string) {
    super(message);
    this.message = message;
  }
}

const isRunningFromXcodeScript = process.env.XCODE_VERSION_ACTUAL;

export function logError(error: Error) {
  if (error instanceof ToolError) {
    logErrorMessage(error.message);
  } else if (error instanceof GraphQLError) {
    const fileName = error.source && error.source.name;
    if (error.locations) {
      for (const location of error.locations) {
        logErrorMessage(error.message, fileName, location.line);
      }
    } else {
      logErrorMessage(error.message, fileName);
    }
  } else {
    console.error(error.stack);
  }
}

export function logErrorMessage(
  message: string,
  fileName?: string,
  lineNumber?: number
) {
  if (isRunningFromXcodeScript) {
    if (fileName && lineNumber) {
      // Prefixing error output with file name, line and 'error: ',
      // so Xcode will associate it with the right file and display the error inline
      console.error(`${fileName}:${lineNumber}: error: ${message}`);
    } else {
      // Prefixing error output with 'error: ', so Xcode will display it as an error
      console.error(`error: ${message}`);
    }
  } else {
    if (fileName) {
      const truncatedFileName =
        "/" +
        fileName
          .split(path.sep)
          .slice(-4)
          .join(path.sep);
      console.error(`...${truncatedFileName}: ${message}`);
    } else {
      console.error(`error: ${message}`);
    }
  }
}
