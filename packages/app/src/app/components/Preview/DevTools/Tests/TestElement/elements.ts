import styled, { css } from 'styled-components';
import { Status } from '..';

export const Actions = styled.div`
  transition: 0.3s ease opacity;
  opacity: 0;
  font-size: 1.125rem;

  color: ${props =>
    props.theme.light ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.7)'};

  svg {
    margin-left: 0.5rem;
    transition: 0.3s ease color;
    opacity: 0.8;
    color: ${props => props.theme['button.hoverBackground']};

    &:hover {
      opacity: 1;
    }
  }
`;

export const TestName = styled.div`
  transition: 0.3s ease background-color;
  padding: 0.25rem;
  padding-left: 20px;
  background-color: ${props => props.theme['sideBar.background']};
  color: ${props =>
    props.theme.light ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.7)'};
  flex: auto;
  white-space: nowrap;
`;

export const Test = styled.div<{ status: Status }>`
  display: flex;
  align-items: center;
  padding-left: 1rem;
  cursor: pointer;

  ${props =>
    props.status === 'idle' &&
    css`
      color: ${props =>
        props.theme.light ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.7)'};
    `};
`;

export const Block = styled.div<{ last: boolean }>`
  transition: 0.3s ease color;
  display: flex;
  padding: 0.25rem 0.4rem;
  padding-left: 0.5rem;
  position: relative;
  margin-right: ${props => (props.last ? 0 : 12)}px;
  color: ${props =>
    props.theme.light ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.7)'};

  white-space: nowrap;

  &::after {
    content: '';
    position: absolute;
    margin: auto;
    top: 3px;
    right: -10px;
    width: 17px;
    height: 17px;
    transform: rotate(45deg);
    border-right: 2px solid
      ${props =>
    !props.theme.light ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.2)'};
    border-right: 2px solid
      ${props =>
    !props.theme.light ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.2)'};
    background-color: ${props => props.theme['button.hoverBackground']};
    z-index: 1;
  }
`;

export const FileData = styled.div`
  display: flex;
  align-items: center;
  font-size: 1rem;
  padding: 0.5rem 1rem;

  cursor: pointer;
`;

export const Path = styled.span`
  color: ${props =>
    props.theme.light ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.7)'};
`;

export const FileName = styled.span`
  color: ${props =>
    props.theme.light ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.7)'};

  flex: 1;
`;

export const Tests = styled.div`
  font-weight: 400;
  color: ${props =>
    props.theme.light ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.7)'};
  overflow-x: auto;

  &::-webkit-scrollbar {
    width: 0;
    height: 0;
  }
`;

export const Container = styled.div<{ selected: boolean }>`
  transition: 0.3s ease all;
  font-weight: 500;
  font-size: 0.875rem;
  border-left: 2px solid transparent;

  &:hover {
    background-color: ${props =>
    !props.theme.light ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.2)'};
    color: ${props =>
    props.theme.light ? 'rgba(0, 0, 0, 1)' : 'rgba(255, 255, 255, 1)'};
    border-left-color: ${props => props.theme.secondary.clearer(0.5)};

    ${Actions} {
      opacity: 1;
    }

    ${Test} {
      ${TestName} {
      }

      ${Block} {
        color: ${props =>
    props.theme.light ? 'rgba(0, 0, 0, 1)' : 'rgba(255, 255, 255, 1)'};
      }
    }
  }

  ${props =>
    props.selected &&
    css`
      border-left-color: ${props.theme.secondary};
      background-color: ${props =>
        !props.theme.light ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.2)'};
      color: ${props =>
        props.theme.light ? 'rgba(0, 0, 0, 1)' : 'rgba(255, 255, 255, 1)'};

      ${Test} {
        ${TestName} {
          background-color: ${props =>
        !props.theme.light
          ? 'rgba(0, 0, 0, 0.2)'
          : 'rgba(255, 255, 255, 0.2)'};
          color: ${props =>
        props.theme.light ? 'rgba(0, 0, 0, 1)' : 'rgba(255, 255, 255, 1)'};
        }

        ${Block} {
          background-color: ${props =>
        !props.theme.light
          ? 'rgba(0, 0, 0, 0.2)'
          : 'rgba(255, 255, 255, 0.2)'};
          color: ${props =>
        props.theme.light ? 'rgba(0, 0, 0, 1)' : 'rgba(255, 255, 255, 1)'};
        }
      }

      &:hover {
        border-left-color: ${props.theme.secondary};
      }
    `};
`;
