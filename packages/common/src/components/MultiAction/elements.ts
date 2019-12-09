import { ComponentProps } from 'react';
import { Button as ReakitButton } from 'reakit/Button';
import { Group } from 'reakit/Group';
import { Menu, MenuItem, MenuDisclosure } from 'reakit/Menu';
import styled, { css } from 'styled-components';

import { Button, buttonStyles } from '../Button';

export const Container = styled(Group)`
  position: relative;
  display: flex;
`;

export const PrimaryAction = styled(ReakitButton)<
  ComponentProps<typeof Button>
>`
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

export const ToggleActionsList = styled(MenuDisclosure)<
  ComponentProps<typeof Button>
>`
  ${buttonStyles};
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 0;
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
  border-left-width: 1px;

  &:focus {
    outline: 0 !important;
  }
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
  width: max-content;
  min-width: 100%;
  margin-top: -2px;
  border-radius: 2px;
  background-color: ${props =>
    props.theme['menu.background'] || props.theme.background4};
  box-shadow: rgba(0, 0, 0, 0.75) 0px 3px 8px;

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
    color: ${theme['menu.foreground'] || 'rgba(255, 255, 255, 0.8)'};
    text-align: initial;
    ${!disabled &&
      css`
        cursor: pointer;
      `};

    &:focus {
      outline: none !important;
    }

    &:focus {
      border-color: rgb(64, 169, 243);
      background-color: ${theme['menu.selectionBackground'] ||
        theme.background3};
      color: ${theme['menu.selectionForeground'] || 'white'};
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
