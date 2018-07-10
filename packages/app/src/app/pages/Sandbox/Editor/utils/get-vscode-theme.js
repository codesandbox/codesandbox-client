import atomLight from './atom-light.json';

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

const theme = {
  ...atomLight,
  colors: {
    ...vs,
    ...atomLight.colors,
  },
};
export default function getTheme() {
  document.body.style.background = theme.colors['editor.background'];
  return {
    themeProvider: {
      ...theme.colors,
      light: true,
      vscodeTheme: theme,
    },
  };
}
