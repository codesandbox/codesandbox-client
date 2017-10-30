import CircularJSON from 'circular-json';
import { isArray } from 'lodash';

function mapConsoleResult(arg: any) {
  if (arg instanceof Error) {
    return arg.stack;
  }

  return arg;
}

export default function consoleResultToJSON(args: any[] | any) {
  const mappedArgs = isArray(args)
    ? args.map(mapConsoleResult)
    : mapConsoleResult(args);

  return CircularJSON.stringify(mappedArgs);
}
