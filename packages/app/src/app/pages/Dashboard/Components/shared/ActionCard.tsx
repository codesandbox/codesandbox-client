import React from 'react';
import {
  Icon,
  IconNames,
  InteractiveOverlay,
  Text,
} from '@codesandbox/components';
import { StyledCard } from './StyledCard';

type ActionCardProps = React.ComponentProps<typeof InteractiveOverlay.Item> & {
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
