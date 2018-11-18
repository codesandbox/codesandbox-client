// @flow

export const getSandboxOptions = (url: string) => {
  const result: Object = {
    editorSize: 50,
  };
  const moduleMatch = url.match(/(\?|&)(module)=([^&]+)/);
  if (moduleMatch) {
    if (moduleMatch[3].indexOf(',') > -1) {
      const tabs = moduleMatch[3].split(',');
      result.tabs = tabs;
      result.currentModule = tabs[0];
    } else {
      result.currentModule = moduleMatch[3];
    }
  }

  const initialPathMatch = url.match(/(\?|&)(initialpath)=([^&]+)/);
  if (initialPathMatch) {
    result.initialPath = decodeURIComponent(initialPathMatch[3]);
  }

  const fontSizeMatch = url.match(/(\?|&)(fontsize)=([^&]+)/);
  if (fontSizeMatch) {
    result.fontSize = +fontSizeMatch[3];
  }

  const highlightMatch = url.match(/(\?|&)(highlights)=([^&]+)/);
  if (highlightMatch && highlightMatch[3]) {
    result.highlightedLines = highlightMatch[3]
      .split(',')
      .map(number => Number(number));
  }

  const editorSizeMatch = url.match(/(\?|&)(editorsize)=([^&]+)/);
  if (editorSizeMatch) {
    result.editorSize = +editorSizeMatch[3];
  }

  result.isPreviewScreen = url.includes('view=preview');
  result.isEditorScreen = url.includes('view=editor');
  result.isSplitScreen = url.includes('view=split');

  result.isTestPreviewWindow = url.includes('previewwindow=tests');
  result.isConsolePreviewWindow = url.includes('previewwindow=console');

  if (result.isTestPreviewWindow && !result.isConsolePreviewWindow) {
    result.previewWindow = 'tests';
  }

  if (!result.isTestPreviewWindow && result.isConsolePreviewWindow) {
    result.previewWindow = 'console';
  }
  // If there is no view specified and the width of the window is <800 we want
  // to default to preview
  if (
    !result.isPreviewScreen &&
    !result.isEditorScreen &&
    !result.isSplitScreen
  ) {
    const windowWidth =
      window.innerWidth ||
      (document.documentElement ? document.documentElement.clientWidth : 0);

    result.isEditorScreen = windowWidth >= 800;
    result.isPreviewScreen = true;
  }

  result.hideNavigation = url.includes('hidenavigation=1');
  result.isInProjectView = !url.includes('moduleview=1');
  result.autoResize = url.includes('autoresize=1');
  result.useCodeMirror = url.includes('codemirror=1');
  result.enableEslint = url.includes('eslint=1');
  result.forceRefresh = url.includes('forcerefresh=1');
  result.expandDevTools = url.includes('expanddevtools=1');
  if (url.includes('verticallayout=')) {
    result.verticalMode = url.includes('verticallayout=1');
  }
  console.log(result);
  result.runOnClick = url.includes('runonclick=0')
    ? false
    : url.includes('runonclick=1')
      ? true
      : undefined;

  console.log(result);
  return result;
};
