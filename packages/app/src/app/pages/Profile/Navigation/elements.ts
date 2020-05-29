import Row from '@codesandbox/common/es/components/flex/Row';
import delayEffect from '@codesandbox/common/es/utils/animation/delay-effect';
import { NavLink } from 'react-router-dom';
import styled, { css } from 'styled-components';

export const NavigationLink = styled(NavLink).attrs({
  activeStyle: {
    color: 'white',
  },
})<{ isLast?: boolean }>`
  ${({ isLast = false }) => css`
    transition: 0.3s ease all;

    display: block;
    color: white;
    padding: 0 4rem;
    margin: 1.5rem 0;
    font-size: 1.25rem;
    font-weight: 300;
    text-shadow: 0 2px 3px rgba(0, 0, 0, 0.3);
    color: rgba(255, 255, 255, 0.5);
    text-decoration: none;

    ${!isLast &&
      css`
        border-right: 1px solid rgba(255, 255, 255, 0.2);
      `};

    ${delayEffect(0.2)};
    &:hover {
      color: white;
    }
  `};
`;

export const CenteredRow = styled(Row)`
  width: 100%;
`;
