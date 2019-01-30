import styled from 'styled-components';
import fadeIn from 'common/utils/animation/fade-in';

export const FullSize = styled.div`
  height: 100%;
  width: 100%;

  ${fadeIn(0)};
  display: flex;
  flex-direction: column;

  background-color: ${props =>
    props.theme['editor.background'] || 'transparent'};
`;

export const ContentTab = styled.div`
  height: 35px;
  display: flex;
  width: 100%;
  background-color: ${props =>
    props.theme['editorGroupHeader.tabsBackground'] ||
    props.theme.background()};

  align-items: center;
  padding: 0 1rem;

  color: white;
`;
