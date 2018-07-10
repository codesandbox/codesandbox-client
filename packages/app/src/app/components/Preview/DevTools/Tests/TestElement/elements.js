import styled, { css } from 'styled-components';

export const Actions = styled.div`
  transition: 0.3s ease opacity;
  opacity: 0;
  font-size: 1.125rem;

  color: white;

  svg {
    margin-left: 0.5rem;
    transition: 0.3s ease color;

    color: rgba(255, 255, 255, 0.6);

    &:hover {
      color: rgba(255, 255, 255, 1);
    }
  }
`;

export const TestName = styled.div`
  transition: 0.3s ease background-color;
  padding: 0.25rem;
  padding-left: 20px;
  background-color: ${props => props.theme.background2};
  color: rgba(255, 255, 255, 0.8);
  flex: auto;
  white-space: nowrap;
`;

export const Test = styled.div`
  display: flex;
  align-items: center;
  padding-left: 1rem;
  cursor: pointer;

  background-color: #181b1d;

  ${props =>
    props.status === 'idle' &&
    css`
      color: rgba(255, 255, 255, 0.4);
    `};
`;

export const Block = styled.div`
  transition: 0.3s ease color;
  display: flex;
  padding: 0.25rem 0.4rem;
  padding-left: 0.5rem;
  position: relative;
  margin-right: ${props => (props.last ? 0 : 12)}px;
  color: rgba(255, 255, 255, 0.5);

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
    -webkit-transform: rotate(45deg);
    -moz-transform: rotate(45deg);
    -o-transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    border-right: 2px solid rgba(0, 0, 0, 0.2);
    border-top: 2px solid rgba(0, 0, 0, 0.2);
    background-color: #181b1d;
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
  color: rgba(255, 255, 255, 0.6);
`;

export const FileName = styled.span`
  color: rgba(255, 255, 255, 0.8);

  flex: 1;
`;

export const Tests = styled.div`
  font-weight: 400;
  color: rgba(255, 255, 255, 0.7);
  overflow-x: auto;

  &::-webkit-scrollbar {
    width: 0;
    height: 0;
  }
`;

export const Container = styled.div`
  transition: 0.3s ease all;
  font-weight: 500;
  font-size: 0.875rem;
  border-left: 2px solid transparent;

  &:hover {
    background-color: rgba(0, 0, 0, 0.2);
    border-left-color: ${props => props.theme.secondary.clearer(0.5)};

    ${Actions} {
      opacity: 1;
    }

    ${Test} {
      ${TestName} {
        background-color: rgba(0, 0, 0, 0.05);
      }

      ${Block} {
        color: rgba(255, 255, 255, 0.8);
      }
    }
  }

  ${props =>
    props.selected &&
    css`
      border-left-color: ${props.theme.secondary};
      background-color: rgba(0, 0, 0, 0.3);

      ${Test} {
        ${TestName} {
          background-color: rgba(0, 0, 0, 0.05);
        }

        ${Block} {
          color: rgba(255, 255, 255, 0.8);
        }
      }

      &:hover {
        border-left-color: ${props.theme.secondary};
        background-color: rgba(0, 0, 0, 0.3);
      }
    `};
`;
