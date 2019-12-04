import delayEffect from '@codesandbox/common/lib/utils/animation/delay-effect';
import React, { ComponentProps, forwardRef } from 'react';
import { Link } from 'react-router-dom';
import { MenuSeparator } from 'reakit';
import styled, { css } from 'styled-components';

export const Container = styled.div`
  ${({ theme }) => css`
    background-color: ${theme.background4};
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.75);

    ${delayEffect(0)};

    min-width: 200px;

    z-index: 20;
  `};
`;

const StyledMenu = styled(Link)<{ href?: string; to?: string }>`
  ${({ theme }) => css`
    transition: 0.3s ease all;
    display: flex;
    align-items: center;
    font-size: 0.875rem;
    padding: 0.5rem 1rem;

    text-decoration: none;

    color: rgba(255, 255, 255, 0.8);
    border: 0;
    outline: 0 !important;
    box-sizing: border-box;
    border-left: 2px solid transparent;
    background-color: transparent;
    width: 100%;

    cursor: pointer;

    &:focus {
      border-color: ${theme.secondary};
      color: white;
      background-color: ${theme.secondary.clearer(0.9)};
      outline: 0;
    }

    &:hover {
      border-color: ${theme.secondary};
      color: white;
      background-color: ${theme.secondary.clearer(0.9)};
    }
  `};
`;

const StyledMenuA = StyledMenu.withComponent('a');
const StyledMenuButton = StyledMenu.withComponent('button');

export const ItemA = forwardRef<
  HTMLAnchorElement,
  ComponentProps<typeof StyledMenuA>
>((props, ref) => <StyledMenuA {...props} ref={ref} />);
export const ItemButton = forwardRef<
  HTMLButtonElement,
  ComponentProps<typeof StyledMenuButton>
>((props, ref) => <StyledMenuButton {...props} ref={ref} />);
export const ItemLink = forwardRef<
  HTMLAnchorElement,
  ComponentProps<typeof StyledMenu>
>((props, ref) => <StyledMenu {...props} innerRef={ref} />);

export const Icon = styled.span`
  margin-right: 0.75rem;
  display: inline-flex;
  align-items: center;
`;

export const Separator = styled(MenuSeparator)`
  ${({ theme }) => css`
    height: 1px;
    width: 100%;
    margin: 0.5rem 0;

    background-color: ${theme.background};
    border: 0;
    outline: 0;
  `};
`;
