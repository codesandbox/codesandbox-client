const expr = /(;|^|}|\s)(import|export)(\s|{|"|\*)/gm;

export default function isESModule(code: string) {
  expr.lastIndex = 0;
  return code.indexOf('export default') !== -1 || expr.test(code);
}
