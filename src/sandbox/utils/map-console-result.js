export default function mapConsoleResult(arg: any) {
  if (arg instanceof Error) {
    return arg.stack;
  }

  return arg;
}
