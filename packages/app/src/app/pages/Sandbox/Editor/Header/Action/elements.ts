import styled, { component } from 'app/styled-components';
import { Link } from 'react-router-dom';
import Tooltip from 'common/components/Tooltip';

const styles = props =>
  `
  display: flex !important;
  transition: 0.3s ease all;
  flex-direction: row;
  align-items: center;
  vertical-align: middle;
  font-size: .875rem;
  line-height: 1;
  height: 100%;
  color: rgba(255,255,255,0.7);
  cursor: pointer;
  box-sizing: inherit;
  border-bottom: 2px solid transparent;
  z-index: 1;
  ${
    props.highlight
      ? `
      background-color: ${props.theme.secondary.darken(0.1)()};
      color: white;
      border-bottom: 1px solid ${props.theme.secondary.darken(0.1)()};

      &:hover {
        background-color: ${props.theme.secondary.darken(0.2)()};
      }
  `
      : `

    &:hover {
      color: rgba(255,255,255, 1);
      border-color: ${
        props.hideBottomHighlight ? 'transparent' : props.theme.secondary()
      }
    }
  `
  }
`;

export const Title = styled.span`
  padding-left: 0.5rem;
`;

export const Action = styled.div`
  ${styles};
`;

export const ActionLink = styled(Link)`
  ${styles} text-decoration: none;
`;

export const ActionA = styled.a`
  ${styles} text-decoration: none;
`;

export const ActionTooltip = styled(component<{
  disabledAction?: boolean
  title: string
  hideOnClick?: boolean
}>(Tooltip))`
  ${styles} ${props =>
      props.disabledAction &&
      `
    color: rgba(255,255,255,0.3);
    cursor: default;

    &:hover {
      color: rgba(255,255,255, 0.4);
    }
  `};
`;

export const IconContainer = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
  padding: 0 0.75rem;
`;
