import JSON from 'json5';

import codesandbox from 'common/themes/codesandbox.json';

import themes from './themes';

const editorBackground = 'editor.background';
const editorForeground = 'editor.foreground';
const editorInactiveSelection = 'editor.inactiveSelectionBackground';
const editorIndentGuides = 'editorIndentGuide.background';
const editorActiveIndentGuides = 'editorIndentGuide.activeBackground';
const editorSelectionHighlight = 'editor.selectionHighlightBackground';

const vs = {
  [editorBackground]: '#FFFFFE',
  [editorForeground]: '#000000',
  [editorInactiveSelection]: '#E5EBF1',
  [editorIndentGuides]: '#D3D3D3',
  [editorActiveIndentGuides]: '#939393',
  [editorSelectionHighlight]: '#ADD6FF4D',
  'titleBar.activeBackground': '#eee',
  'titleBar.activeForeground': '#939393',
};
const vsDark = {
  [editorBackground]: '#1E1E1E',
  [editorForeground]: '#D4D4D4',
  [editorInactiveSelection]: '#3A3D41',
  [editorIndentGuides]: '#404040',
  [editorActiveIndentGuides]: '#707070',
  [editorSelectionHighlight]: '#ADD6FF26',
};

function fetchTheme(foundTheme) {
  if (!foundTheme) {
    return codesandbox;
  }

  if (foundTheme.content) {
    return foundTheme.content;
  }

  if (foundTheme.get) {
    return foundTheme.get();
  }

  return window.fetch(foundTheme.url).then(x => x.json());
}

const findTheme = async (themeName, customTheme) => {
  if (customTheme) {
    try {
      return JSON.parse(customTheme.replace(/^\s*\/\/"/gm, ''));
    } catch (e) {
      console.error(e);

      if (window.showNotification) {
        window.showNotification(
          'We had trouble parsing your custom VSCode Theme, error: \n' +
            e.message,
          'error'
        );
      }
    }
  }

  const foundTheme = themes.find(t => t.name === themeName);

  const fetchedTheme = await fetchTheme(foundTheme);

  return {
    ...fetchedTheme,
    type: (foundTheme && foundTheme.type) || fetchedTheme.type,
  };
};

export default async function getTheme(themeName, customTheme) {
  const foundTheme = await findTheme(themeName, customTheme);

  // Explicitly check for dark as that is the default
  const isLight = foundTheme.type !== 'dark' && foundTheme.type !== 'hc';

  const colors = {
    ...(isLight ? vs : vsDark),
    ...foundTheme.colors,
  };

  const theme = {
    ...foundTheme,
    colors,
  };

  document.body.style.background = theme.colors['editor.background'];
  return {
    ...theme.colors,
    light: isLight,
    vscodeTheme: theme,
  };
}
