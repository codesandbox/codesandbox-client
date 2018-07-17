const fontFamilies = (...families) =>
  families
    .filter(Boolean)
    .map(
      family => (family.indexOf(' ') !== -1 ? JSON.stringify(family) : family)
    )
    .join(', ');

export default function getEditorSettings(settings) {
  return {
    selectOnLineNumbers: true,
    fontSize: settings.fontSize,
    fontFamily: fontFamilies(
      settings.fontFamily === 'Dank Mono' ? 'dm' : settings.fontFamily,
      'Menlo',
      'Source Code Pro',
      'monospace'
    ),
    fontLigatures: settings.enableLigatures,
    minimap: {
      enabled: false,
    },
    formatOnPaste: true,
    lineHeight: (settings.lineHeight || 1.5) * settings.fontSize,
    folding: true,
    glyphMargin: false,
    fixedOverflowWidgets: true,
  };
}
