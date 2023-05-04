export function getPrefixedPresetName(preset: string, isV7: boolean) {
  const [first, ...parts] = preset.split('/');
  const secondPrefix = isV7 ? '@babel/preset-' : 'babel-preset-';
  const prefixedName = preset.startsWith('@')
    ? first + '/babel-preset-' + parts.join('/')
    : `${secondPrefix}${preset}`;

  return prefixedName;
}

export function getPrefixedPluginName(plugin: string, isV7: boolean) {
  const [first, ...parts] = plugin.split('/');
  const secondPrefix = isV7 ? '@babel/plugin-' : 'babel-plugin-';
  const prefixedName = plugin.startsWith('@')
    ? first + '/babel-plugin-' + parts.join('/')
    : `${secondPrefix}${plugin}`;

  return prefixedName;
}
