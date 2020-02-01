import Tooltip from '@codesandbox/common/lib/components/Tooltip';
import React, { ComponentProps, ComponentType, FunctionComponent } from 'react';

import { IconContainer } from './elements';

type Props = {
  Icon: ComponentType;
  tooltip: string;
} & Partial<Pick<ComponentProps<typeof IconContainer>, 'isSecond'>>;
export const Button: FunctionComponent<Props> = ({
  Icon,
  isSecond = false,
  tooltip,
}) => (
  <IconContainer isSecond={isSecond}>
    <Tooltip content={tooltip}>
      <Icon />
    </Tooltip>
  </IconContainer>
);
