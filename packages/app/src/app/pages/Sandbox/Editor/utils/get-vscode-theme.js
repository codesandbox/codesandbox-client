// import atomLight from './themes/atom-light.json';
import atomDark from './themes/atom-dark.json';
// import nightOwl from './themes/night-owl.json';
// import codesandbox from './themes/codesandbox.json';

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

const currentTheme = atomDark;

// Explicitly check for dark as that is the default
const isLight = currentTheme.type !== 'dark';

const theme = {
  ...currentTheme,
  colors: {
    ...(isLight ? vs : vsDark),
    ...currentTheme.colors,
  },
};
export default function getTheme() {
  document.body.style.background = theme.colors['editor.background'];
  return {
    themeProvider: {
      ...theme.colors,
      light: isLight,
      vscodeTheme: theme,
    },
  };
}
