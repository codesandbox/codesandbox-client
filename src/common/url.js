// @flow

export const getSandboxOptions = () => {
  const result = {};
  const moduleMatch = location.search.match(/(\?|\&)(module)\=([^&]+)/);
  if (moduleMatch) {
    result.currentModule = moduleMatch[3];
  }
  result.isPreviewScreen = location.search.includes('view=preview');
  result.isEditorScreen = location.search.includes('view=editor');

  // If there is no view specified and the width of the window is <800 we want
  // to default to preview
  if (!result.isPreviewScreen && !result.isEditorScreen) {
    const windowWidth =
      window.innerWidth || document.documentElement.clientWidth;
    result.isPreviewScreen = windowWidth < 800;
  }

  result.hideNavigation = location.search.includes('hidenavigation=1');
  result.autoResize = location.search.includes('autoresize=1');

  return result;
};
