import React, { ComponentType, FunctionComponent, HTMLAttributes } from 'react';

import { Tooltip } from './elements';

type Props = {
  disabled?: boolean;
  Icon: ComponentType;
  tooltip: string;
} & Pick<HTMLAttributes<HTMLButtonElement>, 'onClick'>;
export const Button: FunctionComponent<Props> = ({
  disabled = false,
  Icon,
  onClick,
  tooltip,
}) => (
  <Tooltip content={tooltip} isEnabled={!disabled}>
    <button type="button" onClick={onClick}>
      <Icon />
    </button>
  </Tooltip>
);
