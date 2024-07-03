import styled, { css } from 'styled-components';
import PrettierIcon from 'react-icons/lib/md/brush';

const HEIGHT = '35px';

export const Container = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  height: ${HEIGHT};
  flex: 0 0 ${HEIGHT};
  color: ${props =>
    props.theme.light ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)'};

  background-color: ${({ theme }) =>
    theme['editorGroupHeader.tabsBackground'] || theme.background4};
`;

export const TabsContainer = styled.div`
  display: flex;
  height: ${HEIGHT};
  flex: 1 0 ${HEIGHT};

  overflow-x: auto;
  overflow-y: hidden;

  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    height: 2px;
  }
`;

interface IStyledPrettierIconProps {
  disabled?: boolean;
}
export const StyledPrettierIcon = styled(PrettierIcon)`
  transition: 0.3s ease opacity;
  width: 1.125rem;
  height: 1.125rem;
  cursor: pointer;

  padding-right: 0.5rem;

  opacity: 0.6;

  &:hover {
    opacity: 1;
  }

  ${(props: IStyledPrettierIconProps) =>
    props.disabled &&
    css`
      opacity: 0;
      pointer-events: none;
    `};
`;

export const IconContainer = styled.div`
  display: flex;
  align-items: center;
  float: right;
  flex-shrink: 1;
  padding: 0 0.75rem;
`;

export const Line = styled.div`
  height: 12px;
  width: 1px;

  background-color: ${props =>
    props.theme['editorGroupHeader.tabsBorder'] || 'rgba(255, 255, 255, 0.3)'};
`;

interface IIconWrapperProps {
  active?: boolean;
  disabled?: boolean;
  theme: any;
}
export const IconWrapper = styled.div`
  svg {
    transition: 0.3s ease opacity;
    width: 1.25rem;
    height: 1.25rem;
    cursor: pointer;

    opacity: 0.6;

    padding-left: 0.5rem;

    &:hover {
      opacity: 1;
    }

    ${(props: IIconWrapperProps) =>
      props.active &&
      css`
        opacity: 1;
        color: ${props.theme['editor.foreground'] || 'white'};
      `};

    ${props =>
      props.disabled &&
      css`
        opacity: 0;
        pointer-events: none;
      `};
  }
`;
