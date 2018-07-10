let isThemeDefined = false;

const cleanHex = hex => {
  if (hex === 'white') {
    return 'ffffff';
  }

  hex.slice(1).slice(0, 6);
};

const getTheme = theme => {
  const { tokenColors = [], colors = {} } = theme;
  const rules = tokenColors
    .filter(t => t.settings && t.scope && t.settings.foreground)
    .reduce((acc, token) => {
      if (token.settings && token.settings.foreground === 'inherit') {
        return acc;
      }

      const settings = {
        foreground: cleanHex(token.settings.foreground),
        background: token.settings.background
          ? cleanHex(token.settings.background)
          : null,
        fontStyle: token.settings.fontStyle || null,
      };

      if (Array.isArray(token.scope)) {
        token.scope.map(s =>
          acc.push({
            token: s,
            ...settings,
          })
        );
      } else {
        acc.push({
          token: token.scope,
          ...settings,
        });
      }

      return acc;
    }, []);

  const newColors = colors;
  Object.keys(colors).forEach(c => {
    if (newColors[c]) return c;

    delete newColors[c];

    return c;
  });

  return {
    colors: newColors,
    rules,
    type: theme.type,
  };
};

const defineTheme = (monaco, theme) => {
  if (!isThemeDefined && theme) {
    const transformedTheme = getTheme(theme);
    monaco.editor.defineTheme('CodeSandbox', {
      base: transformedTheme.type === 'dark' ? `vs-dark` : 'vs',
      inherit: true,
      colors: transformedTheme.colors,
      rules: transformedTheme.rules,
    });
    isThemeDefined = true;
  }
};

export default defineTheme;
