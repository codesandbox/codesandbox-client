// @flow
import styled from 'styled-components';
import { isIOS } from '@codesandbox/common/lib/utils/platform';

export const Container = styled.div`
  flex: 250px;
  width: 250px;
  /* There is a bug with ios that causes the sidebar to be longer than the preview, when you then
   * scroll the preview it scrolls the editor down (page is longer). If I set this to 100% scrolling
   * is broken in Chrome though. That's why we have this check */
  height: ${isIOS ? '100%' : '100vh'};
  color: rgba(255, 255, 255, 0.8);
  z-index: 10;
  background-color: ${props => props.theme.sidebar};
  overflow: auto;
`;

export const Title = styled.h2`
  font-weight: 400;
  padding: 0 1rem;
  margin: 0;
  font-size: 1rem;
  margin-top: 0.9rem;
  margin-bottom: 0.9rem;
  vertical-align: middle;
  box-sizing: border-box;
`;

export const Subtitle = styled.h3`
  font-size: 0.875rem;
  margin: 0.5rem 1rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.5);
`;

export const Description = styled.p`
  font-size: 0.875rem;
  padding: 0 1rem;
`;

export const Item = styled.div`
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
  ${({ hover, theme }) =>
    hover && `&:hover { background-color: ${theme.background.darken(0.3)()};}`};
`;

export const Version = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  right: 1rem;
  top: 0;
  bottom: 0;
  vertical-align: middle;
  line-height: 1em;
  color: rgba(255, 255, 255, 0.3);
`;

export const Author = styled.div`
  font-size: 0.875rem;
  margin: 0 1rem;
  margin-bottom: 1rem;
`;
