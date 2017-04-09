// @flow

export const getSandboxOptions = () => {
  const result = {};
  const moduleMatch = location.search.match(/(\?|\&)(module)\=([^&]+)/);
  if (moduleMatch) {
    result.currentModule = moduleMatch[3];
  }
  result.isPreviewScreen = location.search.includes('view=preview');
  result.isEditorScreen = location.search.includes('view=editor');

  return result;
};
