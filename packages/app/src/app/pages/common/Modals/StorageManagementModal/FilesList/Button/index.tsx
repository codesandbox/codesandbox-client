import React, { ComponentType, FunctionComponent, HTMLAttributes } from 'react';
import { ButtonComponent, Tooltip } from './elements';

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
    <ButtonComponent onClick={onClick} type="button">
      <Icon />
    </ButtonComponent>
  </Tooltip>
);
