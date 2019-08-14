import React from 'react';
import Tooltip from '@codesandbox/common/lib/components/Tooltip';
import {
  Title,
  Container,
  ActionLink,
  ActionA,
  ActionTooltip,
  IconContainer,
  MoreInfoIcon,
} from './elements';
import { ActionProps } from './types';

export const Action = ({
  onClick,
  href,
  a,
  Icon,
  title,
  tooltip,
  highlight,
  placeholder,
  moreInfo,
  unresponsive,
  iconProps = {},
  iconContainerProps = {},
  children,
  ...props
}: ActionProps) => {
  if (!href && (placeholder || tooltip)) {
    return (
      <Container onClick={onClick} {...props}>
        <Tooltip content={placeholder || tooltip} hideOnClick={false}>
          <IconContainer {...iconContainerProps}>
            <Icon {...iconProps} />
            {title !== undefined && <Title>{title}</Title>}
            {moreInfo && <MoreInfoIcon />}
          </IconContainer>
          {children}
        </Tooltip>
      </Container>
    );
  }

  if (onClick) {
    return (
      <Container onClick={onClick} highlight={highlight} {...props}>
        <IconContainer {...iconContainerProps}>
          <Icon {...iconProps} />
          {title !== undefined && <Title>{title}</Title>}
          {moreInfo && <MoreInfoIcon />}
        </IconContainer>
        {children}
      </Container>
    );
  }

  if (href && a && (placeholder || tooltip)) {
    return (
      <ActionA href={href} target="_blank" rel="noopener noreferrer">
        <ActionTooltip content={placeholder || tooltip}>
          <IconContainer {...iconContainerProps}>
            <Icon {...iconProps} />
            {title !== undefined && <Title>{title}</Title>}
            {moreInfo && <MoreInfoIcon />}
          </IconContainer>
        </ActionTooltip>
        {children}
      </ActionA>
    );
  }

  if (href && (placeholder || tooltip)) {
    return (
      <ActionLink to={href} {...props}>
        <ActionTooltip content={placeholder || tooltip}>
          <IconContainer>
            <Icon {...iconProps} />
            {title !== undefined && <Title>{title}</Title>}
            {moreInfo && <MoreInfoIcon />}
          </IconContainer>
        </ActionTooltip>
        {children}
      </ActionLink>
    );
  }

  return (
    <ActionLink to={href} {...props}>
      <IconContainer {...iconContainerProps}>
        <Icon {...iconProps} />
        {title !== undefined && <Title>{title}</Title>}
        {moreInfo && <MoreInfoIcon />}
      </IconContainer>
      {children}
    </ActionLink>
  );
};
