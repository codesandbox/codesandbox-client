export function packageFilter(p) {
  if (p.module) {
    p.main = p.module;
  }

  return p;
}
