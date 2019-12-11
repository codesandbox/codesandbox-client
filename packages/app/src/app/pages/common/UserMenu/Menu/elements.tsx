import delayEffect from '@codesandbox/common/lib/utils/animation/delay-effect';
import React, { ComponentProps, forwardRef } from 'react';
import { Link } from 'react-router-dom';
import { MenuSeparator } from 'reakit';
import styled, { css } from 'styled-components';

export const Container = styled.div`
  ${({ theme }) => css`
    background-color: #151515;
    box-shadow: 0px 8px 4px rgba(0, 0, 0, 0.12),
      0px 8px 16px rgba(0, 0, 0, 0.24);

    ${delayEffect(0)};

    min-width: 225px;
    padding: 1rem 0;
    border-radius: 4px;

    z-index: 20;
  `};
`;

const StyledMenu = styled(Link)<{ href?: string; to?: string }>`
  ${({ theme }) => css`
    font-family: 'Inter', 'Roboto', sans-serif;
    font-weight: 400;
    transition: 0.3s ease all;
    display: flex;
    align-items: center;
    font-size: 13px;
    padding: 0.25rem 1rem;

    text-decoration: none;

    color: #999;
    border: 0;
    outline: 0 !important;
    box-sizing: border-box;
    background-color: transparent;
    width: 100%;

    cursor: pointer;

    svg {
      color: white;
    }

    &:focus {
      color: white;
      background-color: #242424;
      outline: 0;
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
  width: 24px;
  height: 24px;
  font-size: 24px;
`;

export const Separator = styled(MenuSeparator)`
  ${({ theme }) => css`
    height: 1px;
    width: 100%;
    margin: 0.25rem 0;

    background-color: ${theme.background};
    border: 0;
    outline: 0;
  `};
`;
