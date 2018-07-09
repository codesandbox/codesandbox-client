let isThemeDefined = false;

const cleanHex = hex => hex.slice(1).slice(0, 6);

const getTheme = async (url: String) => {
  const theme = await fetch(
    'https://cdn.rawgit.com/sdras/night-owl-vscode-theme/master/themes/Night%20Owl-color-theme.json'
  );

  const { tokenColors, colors } = await theme.json();
  const rules = tokenColors
    .filter(t => t.settings && t.scope && t.settings.foreground)
    .reduce((acc, token) => {
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
  return { colors, rules };
};

const defineTheme = async monaco => {
  if (!isThemeDefined) {
    monaco.editor.defineTheme('CodeSandbox', {
      base: 'vs-dark', // can also be vs-dark or hc-black
      inherit: true,
      colors: await getTheme().colors,
      rules: await getTheme().rules,
    });
    isThemeDefined = true;
  }
};

export default defineTheme;
