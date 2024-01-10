/* eslint-disable */
const specialValues = {
  null: null,
  true: true as const,
  false: false as const,
};

export default function parseQuery(query: string) {
  if (query.substr(0, 1) !== '?') {
    throw new Error(
      "A valid query string passed to parseQuery should begin with '?'"
    );
  }
  query = query.substr(1);
  if (!query) {
    return {};
  }
  if (query.substr(0, 1) === '{' && query.substr(-1) === '}') {
    return JSON.parse(query);
  }
  const queryArgs = query.split(/[,&]/g);
  const result: { [key: string]: any } = {};
  queryArgs.forEach(arg => {
    const idx = arg.indexOf('=');
    if (idx >= 0) {
      let name = arg.substr(0, idx);
      let value: any = decodeURIComponent(arg.substr(idx + 1));
      if (specialValues.hasOwnProperty(value)) {
        // @ts-ignore Reapplying new value with different type is weird for TS
        value = specialValues[value];
      }
      if (name.substr(-2) === '[]') {
        name = decodeURIComponent(name.substr(0, name.length - 2));
        if (!Array.isArray(result[name])) result[name] = [];
        result[name].push(value);
      } else {
        name = decodeURIComponent(name);
        result[name] = value;
      }
    } else {
      if (arg.substr(0, 1) === '-') {
        result[decodeURIComponent(arg.substr(1))] = false;
      } else if (arg.substr(0, 1) === '+') {
        result[decodeURIComponent(arg.substr(1))] = true;
      } else {
        result[decodeURIComponent(arg)] = true;
      }
    }
  });
  return result;
}
