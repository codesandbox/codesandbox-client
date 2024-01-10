import { Popover, PopoverDisclosure } from 'reakit/Popover';
import styled, { css } from 'styled-components';

const buttonStyles = css`
  padding: 0;
  border: 0;
  background: transparent;
  cursor: pointer;
`;

export const IconButton = styled.button`
  ${buttonStyles}
`;

export const IconWrapper = styled(Popover)`
  ${({ theme }) => css`
    z-index: 12;
    padding: ${theme.space[3]}px;
    background: ${theme.colors.sideBar.background};
  `};
`;

export const IconList = styled.ul`
  ${({ theme }) => css`
    list-style: none;
    display: grid;
    padding: ${theme.space[2]}px;
    margin: 0;
    grid-template-columns: repeat(7, 24px);
    grid-gap: 10px;
    border: 1px solid ${theme.colors.sideBar.border};

    li {
      cursor: pointer;
    }
  `};
`;

export const OpenPopover = styled(PopoverDisclosure)`
  ${buttonStyles};

  color: inherit;
  width: 100%;
`;
