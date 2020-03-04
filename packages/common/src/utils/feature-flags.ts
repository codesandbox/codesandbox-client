/**
  poor man's feature flags

  you can export a constant which enables/disables a feature

  it's a TS file, so you can add whatever logic you want as long as it's static
*/


export const REDESIGNED_SIDEBAR = 'true';
export const COMMENTS =
  localStorage.getItem('COMMENTS_CODESANDBOX') === 'true' || false;
export const ACCESS_SHEET = localStorage.getItem('ACCESS_SHEET') || false;
