const expr = /(;|^|})(import|export)(\s|{)/gm;

export default function isESModule(code: string) {
  expr.lastIndex = 0;
  return expr.test(code);
}
