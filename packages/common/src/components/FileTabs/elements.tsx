import React from 'react';
import styled from 'styled-components';
import PlusIcon from 'react-icons/lib/go/plus';
import nu from './nu-theme';
import Row from '../flex/Row';

export const Container = styled(Row)`
  background: ${nu.colors.grays[5]};
  box-shadow: inset 0px -2px 0px ${nu.colors.grays[0] + '1a'};
  font-size: ${nu.fontSizes[1]}px;
`;

// close icon is a lie, it's just a rotated PlusIcon
// TODO: replace it with a skinny X
const CloseIcon = styled.span`
  font-size: ${nu.fontSizes[0]}px;
  display: inline-block;
  margin: 0 ${nu.space[1]}px;
  opacity: 0;

  transform: rotate(45deg);
`;

export const Tab = styled(Row)`
  color: ${nu.colors.white};
  padding: ${nu.space[3]}px 0;
  padding-left: ${nu.space[2]}px;
  cursor: pointer;
  &[aria-selected] {
    box-shadow: inset 0px -2px 0px ${nu.colors.blues[0]};
    & ${CloseIcon} {
      opacity: 1;
    }
  }
  &:hover ${CloseIcon} {
    opacity: 1;
  }
`;

export function Close(props) {
  return (
    <CloseIcon>
      <PlusIcon />
    </CloseIcon>
  );
}
