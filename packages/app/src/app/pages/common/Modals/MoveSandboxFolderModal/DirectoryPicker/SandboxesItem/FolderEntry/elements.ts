import styled, { css } from 'styled-components';
import { NavLink } from 'react-router-dom';
import ChevronRight from 'react-icons/lib/md/chevron-right';

const activeStyles = css`
  outline: none;
  background-color: ${props => props.theme.colors.grays[600]};
  color: rgba(255, 255, 255, 1);
`;
export const Container = styled(NavLink)<{
  depth?: number;
  active?: boolean;
  disabled?: boolean;
}>`
  transition: 0.25s ease all;
  display: flex;
  align-items: center;
  height: 1.8rem;
  border-radius: 2px;

  color: rgba(255, 255, 255, 0.6);
  text-decoration: none;

  padding-left: ${props => (props.depth || 0) * 0.75}rem;

  user-select: none;

  cursor: pointer;

  &:hover {
    color: rgba(255, 255, 255, 0.8);
    ${activeStyles}
  }

  ${props => props.active && activeStyles}

  &:focus {
    color: rgba(255, 255, 255, 0.8);
    ${activeStyles}
  }

  ${props =>
    props.disabled
      ? css`
          opacity: 0.8;
          outline: none;
        `
      : css`
          cursor: pointer;

          &:hover {
            color: rgba(255, 255, 255, 0.8);
          }

          &:focus {
            outline: none;
            border-color: ${() => props.theme.secondary.clearer(0.5)};
            color: rgba(255, 255, 255, 0.8);
          }
        `}
`;

export const CreateDirectoryContainer = Container.withComponent('div');

export const IconContainer = styled.div`
  display: flex;
  align-items: center;
  width: 3rem;
  font-size: 1.125rem;
`;

export const AnimatedChevron = styled(ChevronRight)<{ open?: boolean }>`
  transition: 0.25s ease transform;
  transform: rotate(${props => (props.open ? 90 : 0)}deg);
  margin-right: 0.25rem;
`;
