const getMessage = (e: Error) => {
  if (e.message.includes('React error #130')) {
    return "ReactDOM is trying to render a module that's not exporting a React component.";
  }
  return e.message;
};

export default function buildErrorMessage(e) {
  const type = e.type || 'compile';

  const title = e.name;
  const message = getMessage(e);
  let line = null;
  let column = null;
  if (!e.hideLine) {
    // Safari
    if (e.line != null) {
      line = e.line;

      // FF
    } else if (e.lineNumber != null) {
      line = e.lineNumber;

      // Chrome
    } else if (e.stack) {
      const matched = e.stack.match(/<anonymous>:(\d+):(\d+)/);
      if (matched) {
        line = matched[1];
        column = matched[2];
      } else {
        // Maybe it's a babel transpiler error
        const babelMatched = e.stack.match(/(\d+):(\d+)/);
        if (babelMatched) {
          line = babelMatched[1];
          column = babelMatched[2];
        }
      }
    }
  }

  return {
    moduleId: e.module ? e.module.id : e.moduleId,
    type,
    title,
    message,
    line: parseInt(line, 10),
    column: parseInt(column, 10),
    payload: e.payload || {},
    severity: e.severity || 'error',
  };
}
