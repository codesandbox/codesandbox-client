import styled from 'styled-components';

export const PageContainer = styled.main`
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.theme.colors.grays[700]};
`;

export const ContentContainer = styled.div`
  max-width: 750px;
  min-width: 450px;
  text-align: center;
`;
