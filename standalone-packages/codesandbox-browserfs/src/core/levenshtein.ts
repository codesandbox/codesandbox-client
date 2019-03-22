/*
 * Levenshtein distance, from the `js-levenshtein` NPM module.
 * Copied here to avoid complexity of adding another CommonJS module dependency.
 */

function _min(d0: number, d1: number, d2: number, bx: number, ay: number): number {
  return d0 < d1 || d2 < d1
      ? d0 > d2
          ? d2 + 1
          : d0 + 1
      : bx === ay
          ? d1
          : d1 + 1;
}

/**
 * Calculates levenshtein distance.
 * @param a
 * @param b
 */
export default function levenshtein(a: string, b: string): number {
  if (a === b) {
    return 0;
  }

  if (a.length > b.length) {
    const tmp = a;
    a = b;
    b = tmp;
  }

  let la = a.length;
  let lb = b.length;

  while (la > 0 && (a.charCodeAt(la - 1) === b.charCodeAt(lb - 1))) {
    la--;
    lb--;
  }

  let offset = 0;

  while (offset < la && (a.charCodeAt(offset) === b.charCodeAt(offset))) {
    offset++;
  }

  la -= offset;
  lb -= offset;

  if (la === 0 || lb === 1) {
    return lb;
  }

  const vector = new Array<number>(la << 1);

  for (let y = 0; y < la;) {
    vector[la + y] = a.charCodeAt(offset + y);
    vector[y] = ++y;
  }

  let x: number;
  let d0: number;
  let d1: number;
  let d2: number;
  let d3: number;
  for (x = 0; (x + 3) < lb;) {
    const bx0 = b.charCodeAt(offset + (d0 = x));
    const bx1 = b.charCodeAt(offset + (d1 = x + 1));
    const bx2 = b.charCodeAt(offset + (d2 = x + 2));
    const bx3 = b.charCodeAt(offset + (d3 = x + 3));
    let dd = (x += 4);
    for (let y = 0; y < la;) {
      const ay = vector[la + y];
      const dy = vector[y];
      d0 = _min(dy, d0, d1, bx0, ay);
      d1 = _min(d0, d1, d2, bx1, ay);
      d2 = _min(d1, d2, d3, bx2, ay);
      dd = _min(d2, d3, dd, bx3, ay);
      vector[y++] = dd;
      d3 = d2;
      d2 = d1;
      d1 = d0;
      d0 = dy;
    }
  }

  let dd: number = 0;
  for (; x < lb;) {
    const bx0 = b.charCodeAt(offset + (d0 = x));
    dd = ++x;
    for (let y = 0; y < la; y++) {
      const dy = vector[y];
      vector[y] = dd = dy < d0 || dd < d0
          ? dy > dd ? dd + 1 : dy + 1
          : bx0 === vector[la + y]
              ? d0
              : d0 + 1;
      d0 = dy;
    }
  }

  return dd;
}
