import styled, { css } from 'styled-components';
import { Status } from '..';

export const Actions = styled.div`
  transition: 0.3s ease opacity;
  opacity: 0;
  font-size: 1.125rem;

  color: ${props =>
    props.theme.light ? 'rgb(0, 0, 0)' : 'rgb(255, 255, 255)'};

  svg {
    margin-left: 0.5rem;
    transition: 0.3s ease opacity;
    opacity: 0.6;
    color: ${props => props.theme['button.hoverBackground']};

    &:hover {
      opacity: 1;
    }
  }
`;

export const TestName = styled.div`
  padding: 0.25rem 0.25rem 0.25rem 20px;
  background-color: ${props => props.theme['sideBar.background']};
  color: ${props =>
    props.theme.light ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)'};
  flex: auto;
  white-space: nowrap;
`;

export const Test = styled.div<{ status: Status }>`
  ${({ status, theme }) => css`
    display: flex;
    align-items: center;
    padding-left: 1rem;
    cursor: pointer;

    ${status === 'idle' &&
      css`
        color: ${theme.light
          ? 'rgba(0, 0, 0, 0.4)'
          : 'rgba(255, 255, 255, 0.4)'};
      `};
  `};
`;

export const Block = styled.div<{ last: boolean }>`
  ${({ last, theme }) => css`
    display: flex;
    padding: 0.25rem 0.4rem 0.25rem 0.5rem;
    position: relative;
    margin-right: ${last ? 0 : 12}px;
    color: ${theme.light ? 'rgba(0, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.5)'};

    white-space: nowrap;

    &::after {
      content: '';
      position: absolute;
      top: 8px;
      right: -10px;
      width: 10px;
      height: 10px;
      transform: rotate(45deg);
      border-right: 1px solid
        ${theme.light
          ? css`rgba(0, 0, 0, ${last ? 0.3 : 0.4})`
          : css`rgba(255, 255, 255, ${last ? 0.3 : 0.4})`};
      border-top: 1px solid
        ${theme.light
          ? css`rgba(0, 0, 0, ${last ? 0.3 : 0.4})`
          : css`rgba(255, 255, 255, ${last ? 0.3 : 0.4})`};
    }
  `};
`;

export const FileData = styled.div`
  display: flex;
  align-items: center;
  font-size: 1rem;
  padding: 0.5rem 1rem;

  cursor: pointer;
`;

export const Path = styled.span`
  ${({ theme }) => css`
    color: ${theme.light ? 'rgba(0, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.6)'};
  `};
`;

export const FileName = styled.span`
  ${({ theme }) => css`
    color: ${theme.light ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)'};

    flex: 1;
  `};
`;

export const Tests = styled.div`
  ${({ theme }) => css`
    font-weight: 400;
    color: ${theme.light ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.7)'};
    overflow-x: auto;

    &::-webkit-scrollbar {
      width: 0;
      height: 0;
    }
  `};
`;

export const Container = styled.div<{ selected: boolean }>`
  ${({ selected, theme }) => css`
    transition: 0.3s ease all;
    font-weight: 500;
    font-size: 0.875rem;
    border-left: 2px solid transparent;

    &:hover {
      background-color: ${!theme.light
        ? 'rgba(0, 0, 0, 0.2)'
        : 'rgba(255, 255, 255, 0.2)'};
      color: ${theme.light ? 'rgba(0, 0, 0, 1)' : 'rgba(255, 255, 255, 1)'};
      border-left-color: ${theme.secondary.clearer(0.5)};

      ${Actions} {
        opacity: 1;
      }

      ${Test} {
        ${Block} {
          color: ${theme.light ? '#000000' : '#FFFFFF'};
        }
      }
    }

    ${selected &&
      css`
        border-left-color: ${theme.secondary};
        background-color: ${!theme.light
          ? 'rgba(0, 0, 0, 0.2)'
          : 'rgba(255, 255, 255, 0.2)'};
        color: ${theme.light ? '#000000' : '#FFFFFF'};

        ${Test} {
          ${TestName} {
            background-color: ${!theme.light
              ? 'rgba(0, 0, 0, 0.2)'
              : 'rgba(255, 255, 255, 0.2)'};
            color: ${theme.light ? '#000000' : '#FFFFFF'};
          }

          ${Block} {
            background-color: ${!theme.light
              ? 'rgba(0, 0, 0, 0.2)'
              : 'rgba(255, 255, 255, 0.2)'};
            color: ${theme.light ? '#000000' : '#FFFFFF'};
          }
        }

        &:hover {
          border-left-color: ${theme.secondary};
        }
      `};
  `};
`;
