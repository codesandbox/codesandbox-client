import React, { AnchorHTMLAttributes, ButtonHTMLAttributes } from 'react';
import {
  Icon,
  IconNames,
  InteractiveOverlay,
  Text,
} from '@codesandbox/components';
import { StyledCard } from './StyledCard';

// TODO: Reuse from @codesandbox/components but didn't see an elegant way to export the type
type ItemElementProps =
  | (AnchorHTMLAttributes<HTMLAnchorElement> & {
      as: 'a';
      href: string;
    })
  | (ButtonHTMLAttributes<HTMLButtonElement> & {
      as: 'button';
      href?: never;
    });

type ActionCardProps = ItemElementProps & {
  disabled?: boolean;
  icon: IconNames;
};

export const ActionCard: React.FC<ActionCardProps> = ({
  icon,
  disabled,
  children,
  ...props
}) => (
  <InteractiveOverlay>
    <StyledCard dimmed={disabled}>
      <Icon name={icon} size={20} />
      <InteractiveOverlay.Item {...props}>
        <Text size={13}>{children}</Text>
      </InteractiveOverlay.Item>
    </StyledCard>
  </InteractiveOverlay>
);
