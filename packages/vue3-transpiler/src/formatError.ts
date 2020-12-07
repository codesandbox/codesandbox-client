import { generateCodeFrame, CompilerError } from 'vue3-browser-compiler';

export function formatError(
  err: SyntaxError | CompilerError,
  source: string,
  file: string
) {
  const loc = (err as CompilerError).loc;
  if (!loc) {
    return;
  }
  const locString = `:${loc.start.line}:${loc.start.column}`;
  const filePath = `at ${file}${locString}`;
  const codeframe = generateCodeFrame(source, loc.start.offset, loc.end.offset);
  err.message = `\n${`VueCompilerError: ${err.message}`}\n${filePath}\n${codeframe}\n`;
}
