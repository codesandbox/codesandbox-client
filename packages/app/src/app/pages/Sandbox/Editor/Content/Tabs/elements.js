import styled, { css } from 'styled-components';
import PrettierIcon from 'react-icons/lib/md/brush';

export const Container = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  height: 2.5rem;
  flex: 0 0 2.5rem;
  color: rgba(255, 255, 255, 0.8);

  background-color: ${({ theme }) => theme.background4};
`;

export const TabsContainer = styled.div`
  display: flex;
  height: 2.5rem;
  flex: 1 0 2.5rem;

  overflow-x: auto;
  overflow-y: hidden;

  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    height: 2px;
  }
`;

export const StyledPrettierIcon = styled(PrettierIcon)`
  transition: 0.3s ease opacity;
  width: 1.125rem;
  height: 1.125rem;
  cursor: pointer;

  opacity: 0.6;

  &:hover {
    opacity: 1;
  }

  ${props =>
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
