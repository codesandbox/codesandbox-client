import React, { ComponentType, FunctionComponent, HTMLAttributes } from 'react';
import styled from 'styled-components';
import { Tooltip } from './elements';

const ButtonComponent = styled.button`
  font-size: 1.2em;
  background-color: inherit;
  border: none;
  padding: 5px 6px 9px 6px;
  color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  &:hover {
    color: rgba(255, 255, 255, 1);
  }
  &[disabled] {
    opacity: 0.5;
    cursor: default;
  }
`;

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
    <ButtonComponent type="button" onClick={onClick}>
      <Icon />
    </ButtonComponent>
  </Tooltip>
);
