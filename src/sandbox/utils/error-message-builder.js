import DependencyNotFoundError from '../errors/dependency-not-found-error';

const getType = error => {
  if (error instanceof DependencyNotFoundError) {
    return 'dependency-not-found';
  }
  return error.type || 'compile';
};

export default function buildErrorMessage(e) {
  const type = getType(e);

  const title = e.name;
  const message = e.message;
  let line = null;
  let column = null;

  // Safari
  if (e.line != null) {
    line = e.line;

    // FF
  } else if (e.lineNumber != null) {
    line = e.lineNumber;

    // Chrome
  } else if (e.stack) {
    const matched = e.stack.match(/(\d+):(\d+)/);
    if (matched) {
      [line, column] = matched;
    }
  }
  return {
    moduleId: e.module ? e.module.id : null,
    type,
    title,
    message,
    line: parseInt(line, 10) - 1,
    column: parseInt(column, 10),
  };
}
