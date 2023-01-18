import React from 'react';
import {
  Icon,
  IconNames,
  InteractiveOverlay,
  Text,
} from '@codesandbox/components';
import { StyledCard } from './StyledCard';

// TODO: Update / replace typeof InteractiveOverlay.Item props
type ActionCardProps = React.ComponentProps<typeof InteractiveOverlay.Item> & {
  disabled?: boolean;
  icon: IconNames;
};

export const ActionCard: React.FC<ActionCardProps> = ({
  icon,
  disabled,
  href,
  children,
  ...props
}) => (
  <InteractiveOverlay>
    <StyledCard dimmed={disabled}>
      <Icon name={icon} size={20} />
      {href ? (
        <InteractiveOverlay.Anchor href={href} radius={4} {...props}>
          <Text size={13}>{children}</Text>
        </InteractiveOverlay.Anchor>
      ) : (
        <InteractiveOverlay.Button disabled={disabled} radius={4} {...props}>
          <Text size={13}>{children}</Text>
        </InteractiveOverlay.Button>
      )}
    </StyledCard>
  </InteractiveOverlay>
);
