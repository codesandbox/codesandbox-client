import { editorUrl } from '@codesandbox/common/lib/utils/url-generator';
import { matchPath, useLocation } from 'react-router-dom';

export const useIsEditorPage = (): boolean => {
  const { pathname } = useLocation();
  const match = matchPath(pathname, editorUrl());
  return match !== null;
};
