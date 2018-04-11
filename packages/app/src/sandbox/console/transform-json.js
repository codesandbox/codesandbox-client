import CircularJSON from 'circular-json';
import { isArray } from 'lodash';

function mapConsoleResult(arg: any) {
  if (arg instanceof Error) {
    return arg.stack;
  }

  if (typeof arg === 'function') {
    return arg.toString();
  }

  // for objects, we recursively call mapConsoleResult on each item
  if (typeof arg === 'object') {
    return Object.entries(arg).reduce((obj, [key, value]) => {
      obj[key] = mapConsoleResult(value); // eslint-disable-line no-param-reassign
      return obj;
    }, {});
  }

  return arg;
}

export default function consoleResultToJSON(args: any[] | any) {
  const mappedArgs = isArray(args)
    ? args.map(mapConsoleResult)
    : mapConsoleResult(args);

  return CircularJSON.stringify(mappedArgs);
}
