export default function isESModule(code: string) {
  return /(;|^)(import|export)(\s|{)/gm.test(code);
}
