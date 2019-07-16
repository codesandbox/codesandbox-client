import styled, { css } from 'styled-components';

import { WorkspaceInputContainer } from '../../elements';

const mapColorToState = (state: string, theme: any) => {
  const STARTING = ['DEPLOYING', 'BUILDING', 'INITIALIZING'];
  const ERROR = ['DEPLOYMENT_ERROR', 'BUILD_ERROR', 'ERROR'];
  const STARTED = ['BOOTED', 'READY'];

  if (STARTING.includes(state)) {
    return '#FCCB7E';
  }
  if (ERROR.includes(state)) {
    return theme.red;
  }
  if (STARTED.includes(state)) {
    return theme.green;
  }
  if (state === 'FROZEN') {
    return theme.blue;
  }

  return theme.gray;
};

export const State = styled.span<{ state: string }>`
  ${({ state, theme }) => css`
    align-items: center;
    display: flex;
    text-transform: capitalize;
    margin-bottom: 0.5rem;

    &:before {
      content: '';
      display: block;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      margin-right: 0.5rem;
      background: ${mapColorToState(state, theme)};
    }
  `};
`;

export const Deploys = styled.ul`
  list-style: none;
  padding: 0;
  flex-direction: column;
  font-size: 0.875rem;
  margin: 0 0.25rem;
`;

export const Deploy = styled.li`
  display: flex;
  margin-bottom: 1.5rem;
  flex-direction: column;
`;

export const Name = styled.span<{ light?: boolean }>`
  ${({ light, theme }) => css`
    font-weight: 600;
    color: ${theme.light || light
      ? css`rgba(0, 0, 0, 0.8)`
      : css`rgba(255, 255, 255, 0.8)`};
    font-size: 1rem;
    margin-top: 0;
    vertical-align: middle;

    span {
      color: ${theme.light || light
        ? theme.background3.darken(0.5)
        : theme.background3.lighten(0.5)};
      font-size: 12px;
      margin-left: 0.5rem;
    }
  `};
`;

const BaseLink = styled.a<{ disabled?: boolean }>`
  padding: 0.25rem 0.4rem;
  background-color: ${props => props.theme.secondary};
  text-decoration: none;
  border: none;
  font-size: 0.75rem;
  color: white;
  border-radius: 2px;
  font-weight: 600;
  margin-top: 0.75rem;
  display: flex;
  align-items: center;
  flex-grow: 0;
  max-width: 50%;

  margin-top: 0;

  svg {
    margin-right: 10px;
  }

  ${props =>
    props.disabled &&
    css`
      background: ${props.theme.gray};
      pointer-events: none;
    `};

  &:disabled {
    background: ${props => props.theme.gray};
  }
`;

export const Link = styled(BaseLink).attrs({
  rel: 'noreferrer noopener',
  target: '_blank',
})``;

export const Action = BaseLink.withComponent('button');

export const ButtonContainer = styled.section`
  display: flex;

  > *:not(:last-child) {
    margin-right: 0.5rem;
  }
`;

export const DeploysContainer = styled.div`
  background-color: #000000;
  border-radius: 0 0 4px 4px;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.875rem;
  margin: -4px 0.75rem 0.5rem;
  padding: 0.75rem 0;
`;

export const Wrapper = styled.div<{ loading: boolean }>`
  ${({ loading }) => css`
    opacity: 1;

    ${loading &&
      css`
        opacity: 0.5;
        pointer-events: none;
      `};
  `};
`;

export const DeployButtonContainer = styled(WorkspaceInputContainer)`
  margin-bottom: 0;
  margin-top: 1rem;
`;
