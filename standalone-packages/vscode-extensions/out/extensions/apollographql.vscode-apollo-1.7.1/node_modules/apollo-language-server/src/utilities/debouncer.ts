import debounce from "lodash.debounce";

export function debounceHandler(handler: (...args: any[]) => any) {
  return debounce(handler, 400, { trailing: true });
}
