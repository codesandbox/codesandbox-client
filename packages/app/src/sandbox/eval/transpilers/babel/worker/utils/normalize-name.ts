export function normalizePluginName(name: string) {
  return name.replace('babel-plugin-', '').replace('@babel/plugin-', '');
}

export function normalizePresetName(name: string) {
  return name.replace('babel-preset-', '').replace('@babel/preset-', '');
}
