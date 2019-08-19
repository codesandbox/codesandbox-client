import styled from 'styled-components';

export const Container = styled.div`
  background-color: ${props =>
    props.theme['panel.background'] || props.theme.background2};
  width: 100%;
  height: 100%;
  color: ${props =>
    props.theme['editor.foreground'] || 'rgba(255, 255, 255, 0.8)'};

  * {
    box-sizing: border-box;
    -webkit-font-smoothing: var(--font-smoothing);
  }
`;
