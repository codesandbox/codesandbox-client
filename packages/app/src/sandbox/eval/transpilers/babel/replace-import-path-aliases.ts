/**
 * Replaces alias in the esmodule code
 */
const createRegex = (pathMap: any) => {
  const mapKeysStr = Object.keys(pathMap).map(item => item.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')).reduce((acc, cur) => `${acc}|${cur}`);
  const regexStr = `^(import[\\s\\S]*?from?\\s+["|'])(${mapKeysStr})(.*)(["|'];?)$`;
  return new RegExp(regexStr, "gm");
}
  
const replaceImportPathAliases = (code: string, pathMap: any) => {
  const regex = createRegex(pathMap);
  const replacer = (_: string, g1: string, aliasGrp: string, restPathGrp: string, g4: string) => `${g1}${pathMap[aliasGrp]}${restPathGrp}${g4}`;
  return code.replace(regex, replacer);
}
  
export default replaceImportPathAliases;
  