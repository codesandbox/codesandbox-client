import styled from 'styled-components';
import { NavLink } from 'react-router-dom';

import Row from 'common/components/flex/Row';
import delayEffect from 'common/utils/animation/delay-effect';

export const NavigationLink = styled(NavLink)`
  transition: 0.3s ease all;

  display: block;
  color: white;
  padding: 0rem 4rem;
  margin: 1.5rem 0;
  font-size: 1.25rem;
  font-weight: 300;
  text-shadow: 0px 2px 3px rgba(0, 0, 0, 0.3);
  color: rgba(255, 255, 255, 0.5);
  text-decoration: none;

  ${({ border }) => border};

  ${delayEffect(0.2)};
  &:hover {
    color: white;
  }
`;

export const CenteredRow = styled(Row)`
  width: 100%;
`;
