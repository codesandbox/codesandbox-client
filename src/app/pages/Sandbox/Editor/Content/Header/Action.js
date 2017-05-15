import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import MoreInfoIcon from 'react-icons/lib/md/arrow-drop-down';

import Tooltip from 'app/components/Tooltip';

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
  ${props.highlight ? `
      background-color: ${props.theme.secondary.darken(0.1)()};
      color: white;
      border-bottom: 1px solid ${props.theme.secondary.darken(0.1)()};

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

const Title = styled.span`
  padding-left: 0.5rem;
  ${props => !props.unresponsive && `
  @media (max-width: 1300px) {
    display: none;
  }`}
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
  ${props => props.disabledAction && `
    color: rgba(255,255,255,0.3);
    cursor: default;

    &:hover {
      color: rgba(255,255,255, 0.4);
    }
  `};
`;

const IconContainer = styled.div`
  display: flex;
  alignItems: center;
  height: 100%;
  padding: 0 .75rem;;
`;

type Props = {
  onClick: ?Function,
  Icon: React.Component<any, any>,
  title: ?string,
  href: ?string,
  placeholder: ?boolean,
  highlight: ?boolean,
  tooltip: ?string,
  moreInfo: ?boolean,
  unresponsive: boolean,
};

export default ({
  onClick,
  href,
  Icon,
  title,
  tooltip,
  highlight,
  placeholder,
  moreInfo,
  unresponsive,
}: Props) => {
  if (!href && (placeholder || tooltip)) {
    return (
      <ActionTooltip
        disabledAction={!onClick}
        title={placeholder || tooltip}
        hideOnClick={false}
      >
        <IconContainer onClick={onClick}>
          <Icon />
          {title !== undefined &&
            <Title unresponsive={unresponsive}>{title}</Title>}
          {moreInfo && <MoreInfoIcon style={{ fontSize: '1.1rem' }} />}
        </IconContainer>
      </ActionTooltip>
    );
  }
  if (onClick) {
    return (
      <Action disabledAction={!onClick} highlight={highlight}>
        <IconContainer onClick={onClick}>
          <Icon />
          {title !== undefined &&
            <Title unresponsive={unresponsive}>{title}</Title>}
          {moreInfo && <MoreInfoIcon style={{ fontSize: '1.1rem' }} />}
        </IconContainer>
      </Action>
    );
  }

  if (href && (placeholder || tooltip)) {
    return (
      <ActionLink to={href}>
        <Tooltip title={placeholder || tooltip}>
          <IconContainer>
            <Icon />
            {title !== undefined &&
              <Title unresponsive={unresponsive}>{title}</Title>}
            {moreInfo && <MoreInfoIcon style={{ fontSize: '1.1rem' }} />}
          </IconContainer>
        </Tooltip>
      </ActionLink>
    );
  }

  return (
    <ActionLink to={href}>
      <IconContainer>
        <Icon />
        {title !== undefined &&
          <Title unresponsive={unresponsive}>{title}</Title>}
        {moreInfo && <MoreInfoIcon style={{ fontSize: '1.1rem' }} />}
      </IconContainer>
    </ActionLink>
  );
};
