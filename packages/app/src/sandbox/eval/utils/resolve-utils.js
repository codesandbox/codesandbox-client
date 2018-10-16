export function packageFilter(p: Object) {
  if (!p.main && p.module) {
    // eslint-disable-next-line
    p.main = p.module;
  }

  return p;
}
