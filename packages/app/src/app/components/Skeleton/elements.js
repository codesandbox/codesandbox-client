import styled from 'styled-components';

export const Header = styled.div`
  position: absolute;
  top: 0;
  height: 3rem;
  left: 0;
  right: 0;
  background-color: ${props => props.theme.background2};
  z-index: 40;
  border-bottom: 1px solid ${props => props.theme.background2.darken(0.3)};
`;
