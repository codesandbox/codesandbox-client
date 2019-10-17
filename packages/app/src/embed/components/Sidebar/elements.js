// @flow
import styled from 'styled-components';
import { isIOS } from '@codesandbox/common/lib/utils/platform';

export const Container = styled.div`
  flex: 250px;
  width: 250px;

  color: white;
  z-index: 10;
  background-color: ${props => props.theme['sideBar.background']};
  overflow: auto;
  font-family: Inter, sans-serif;

  /* There is a bug with ios that causes the sidebar to be longer than the preview, when you then
   * scroll the preview it scrolls the editor down (page is longer). If I set this to 100% scrolling
   * is broken in Chrome though. That's why we have this check */
  height: ${isIOS ? '100%' : '100vh'};
`;
