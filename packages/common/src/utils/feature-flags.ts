/**
  poor man's feature flags

  you can export a constant which enables/disables a feature

  it's a TS file, so you can add whatever logic you want as long as it's static
*/

export const REDESIGNED_SIDEBAR =
  localStorage.getItem('REDESIGNED_SIDEBAR') || false;

export const COMMENTS =
  localStorage.getItem('COMMENTS_CODESANDBOX') === 'true' || false;
