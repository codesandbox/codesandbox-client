import styled from 'styled-components';
import { Aside } from './../_sidebar.elements';

export const BadgeWrapper = styled.ul`
  margin: 0;
  padding: 0;
  margin-top: 20px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  > * {
    margin-right: 10px;
  }
`;

export const BadgeAside = styled(Aside)`
  margin-top: 1rem;
  @media screen and (max-width: 1100px) {
    margin-top: 0px;
  }
  @media screen and (max-width: 767px) {
    display: none;
  }
`;
