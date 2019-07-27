import styled, { css } from 'styled-components';
import { Group } from 'reakit/Group';
import { Button } from 'reakit/Button';
import { Menu, MenuItem, MenuDisclosure } from 'reakit/Menu';
import { IBaseProps, buttonStyles } from '../Button';
import { withoutProps } from '../../utils';

export const Container = styled(Group)`
  position: relative;
  display: flex;
`;

export const PrimaryAction = styled(
  withoutProps(`block`, `secondary`, `danger`, `red`, `small`)(Button)
)<IBaseProps>`
  ${({ block }) => css`
    ${buttonStyles};
    justify-content: center;
    width: ${block ? '100%' : 'inherit'};
    border-radius: 0;
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
    border-right-width: 1px;
  `}
`;

export const ToggleActionsList = styled(
  withoutProps(`block`, `secondary`, `danger`, `red`, `small`)(MenuDisclosure)
)<IBaseProps>`
  ${buttonStyles};
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 0;
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
  border-left-width: 1px;
`;

export const ActionsList = styled(Menu).attrs({
  modal: false,
  style: {
    zIndex: 1,
    top: '32px',
    left: 'inherit',
    right: '0px',
    transform: 'none',
  },
})`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top: 6px;
  border-radius: 4px;
  background-color: rgb(20, 22, 24);
  box-shadow: rgba(0, 0, 0, 0.75) 0px 3px 8px;
  animation: 0.3s ease 0s 1 normal forwards running dXMxHg;

  &:focus {
    outline: none !important;
  }
`;

export const SecondaryAction = styled(MenuItem)<{ disabled?: boolean }>`
  ${({ disabled, theme }) => css`
    display: inline-flex;
    padding: 0.5rem 1rem;
    border: none;
    background: none;
    color: rgba(255, 255, 255, 0.8);
    ${theme.fonts.primary.normal};
    text-align: initial;
    transition: all 0.3s ease 0s;
    ${!disabled && `cursor: pointer;`};

    &:focus {
      outline: none !important;
    }

    &:hover,
    &:focus {
      border-color: rgb(64, 169, 243);
      background-color: rgba(64, 169, 243, 0.098);
      color: white;
    }

    &:first-child {
      border-top-left-radius: 4px;
      border-top-right-radius: 4px;
    }

    &:last-child {
      border-bottom-left-radius: 4px;
      border-bottom-right-radius: 4px;
    }
  `}
`;
