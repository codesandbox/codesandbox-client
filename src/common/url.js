// @flow

export const getSandboxOptions = (url: string) => {
  const result: Object = {
    editorSize: 50,
  };
  const moduleMatch = url.match(/(\?|&)(module)=([^&]+)/);
  if (moduleMatch) {
    result.currentModule = moduleMatch[3];
  }

  const initialPathMatch = url.match(/(\?|&)(initialpath)=([^&]+)/);
  if (initialPathMatch) {
    result.initialPath = decodeURIComponent(initialPathMatch[3]);
  }

  const fontSizeMatch = url.match(/(\?|&)(fontsize)=([^&]+)/);
  if (fontSizeMatch) {
    result.fontSize = +fontSizeMatch[3];
  }

  const editorSizeMatch = url.match(/(\?|&)(editorsize)=([^&]+)/);
  if (editorSizeMatch) {
    result.editorSize = +editorSizeMatch[3];
  }

  result.isPreviewScreen = url.includes('view=preview');
  result.isEditorScreen = url.includes('view=editor');

  // If there is no view specified and the width of the window is <800 we want
  // to default to preview
  if (!result.isPreviewScreen && !result.isEditorScreen) {
    const windowWidth =
      window.innerWidth || document.documentElement.clientWidth;
    result.isPreviewScreen = windowWidth < 800;
  }

  result.hideNavigation = url.includes('hidenavigation=1');
  result.isInProjectView = !url.includes('moduleview=1');
  result.autoResize = url.includes('autoresize=1');
  result.useCodeMirror = url.includes('codemirror=1');
  result.enableEslint = url.includes('eslint=1');

  return result;
};
