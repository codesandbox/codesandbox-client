import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import Tooltip from 'app/components/Tooltip';

const styles = props =>
  `
  transition: 0.3s ease all;
  display: flex;
  flex-direction: row;
  align-items: center;
  vertical-align: middle;
  font-size: 1rem;
  line-height: 1;
  padding: 0 1rem;
  height: 100%;
  color: rgba(255,255,255,0.7);
  cursor: pointer;
  box-sizing: inherit;
  border-bottom: 2px solid transparent;
  z-index: 1;
  ${props.highlight ? `
      background-color: ${props.theme.secondary.darken(0.1)()};
      color: white;
      border-bottom: 0px solid transparent;

      &:hover {
        background-color: ${props.theme.secondary.darken(0.2)()};
      }
  ` : `

    &:hover {
      color: rgba(255,255,255, 1);
      border-color: ${props.theme.secondary()}
    }
  `}


`;

const Action = styled.div`
  ${styles}
`;

const ActionLink = styled(Link)`
  ${styles}
  text-decoration: none;
`;

const ActionTooltip = styled(Tooltip)`
  ${styles}
  color: rgba(255,255,255,0.3);
  cursor: default;

  &:hover {
    color: rgba(255,255,255, 0.4);
  }
`;

const IconContainer = styled.div`
  padding-right: 0.5rem;
  vertical-align: middle;
`;

type Props = {
  onClick: ?Function,
  Icon: React.Component<any, any>,
  title: string,
  href: ?string,
  placeholder: ?boolean,
  highlight: ?boolean,
};

export default ({
  onClick,
  href,
  Icon,
  title,
  highlight,
  placeholder,
}: Props) => {
  if (placeholder) {
    return (
      <ActionTooltip message={placeholder}>
        <IconContainer>
          <Icon />
        </IconContainer> {title}
      </ActionTooltip>
    );
  }
  if (onClick) {
    return (
      <Action highlight={highlight} onClick={onClick}>
        <IconContainer>
          <Icon />
        </IconContainer> {title}
      </Action>
    );
  }

  return (
    <ActionLink highlight={highlight} to={href}>
      <IconContainer>
        <Icon />
      </IconContainer> {title}
    </ActionLink>
  );
};
