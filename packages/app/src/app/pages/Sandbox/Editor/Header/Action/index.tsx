import React from 'react';

import MoreInfoIcon from 'react-icons/lib/md/arrow-drop-down';

import {
  Title,
  Action,
  ActionLink,
  ActionA,
  ActionTooltip,
  IconContainer,
} from './elements';

interface UrlProps {
  href?: string;
  a?: boolean;
}

interface ClickProps {
  onClick?: () => void;
}

type Props = (UrlProps & ClickProps) & {
  moreInfo?: boolean;
  unresponsive?: boolean;
  iconProps?: object;
  iconContainerProps?: object;
  title?: string;
  tooltip?: string;
  highlight?: boolean;
  placeholder?: string | false;
  blink?: boolean;
  children?: React.ReactChildren;
  Icon: React.ComponentType;
};

function ActionComponent({
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
}: Props) {
  if (!href && (placeholder || tooltip)) {
    return (
      <ActionTooltip
        disabledAction={!onClick}
        title={placeholder || tooltip}
        hideOnClick={false}
        {...props}
      >
        <IconContainer onClick={onClick} {...iconContainerProps}>
          <Icon {...iconProps} />
          {title !== undefined && <Title>{title}</Title>}
          {moreInfo && <MoreInfoIcon style={{ fontSize: '1.1rem' }} />}
        </IconContainer>
        {children}
      </ActionTooltip>
    );
  }
  if (onClick) {
    return (
      <Action highlight={highlight} {...props}>
        <IconContainer onClick={onClick} {...iconContainerProps}>
          <Icon {...iconProps} />
          {title !== undefined && <Title>{title}</Title>}
          {moreInfo && <MoreInfoIcon style={{ fontSize: '1.1rem' }} />}
        </IconContainer>
        {children}
      </Action>
    );
  }

  if (href && a && (placeholder || tooltip)) {
    return (
      <ActionA href={href} target="_blank" rel="noopener noreferrer">
        <ActionTooltip title={placeholder || tooltip}>
          <IconContainer {...iconContainerProps}>
            <Icon {...iconProps} />
            {title !== undefined && <Title>{title}</Title>}
            {moreInfo && <MoreInfoIcon style={{ fontSize: '1.1rem' }} />}
          </IconContainer>
        </ActionTooltip>
        {children}
      </ActionA>
    );
  }

  if (href && (placeholder || tooltip)) {
    return (
      <ActionLink to={href} {...props}>
        <ActionTooltip title={placeholder || tooltip}>
          <IconContainer>
            <Icon {...iconProps} />
            {title !== undefined && <Title>{title}</Title>}
            {moreInfo && <MoreInfoIcon style={{ fontSize: '1.1rem' }} />}
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
        {moreInfo && <MoreInfoIcon style={{ fontSize: '1.1rem' }} />}
      </IconContainer>
      {children}
    </ActionLink>
  );
}

export default ActionComponent;
