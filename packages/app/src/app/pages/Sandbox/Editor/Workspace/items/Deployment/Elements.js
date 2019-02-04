import styled, { css } from 'styled-components';

const mapColorToState = (state, theme) => {
  const STARTING = ['DEPLOYING', 'BUILDING', 'INITIALIZING'];
  const ERROR = ['DEPLOYMENT_ERROR', 'BUILD_ERROR', 'ERROR'];
  const STARTED = ['BOOTED', 'READY'];

  if (STARTING.includes(state)) return '#fccb7e';
  if (ERROR.includes(state)) return theme.red;
  if (STARTED.includes(state)) return theme.green;
  if (state === 'FROZEN') return theme.blue;

  return theme.gray;
};

export const Deploys = styled.ul`
  list-style: none;
  padding: 0;
  margin-top: 1rem;
  flex-direction: column;
  font-size: 0.875rem;
  margin: 0 0.25rem;
`;

export const Deploy = styled.li`
  display: flex;
  margin-bottom: 1.5rem;
  flex-direction: column;
`;

export const State = styled.span`
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
    background: ${props => mapColorToState(props.state, props.theme)};
  }
`;

export const Name = styled.span`
  font-weight: 600;
  color: ${props =>
    props.theme.light || props.light
      ? 'rgba(0, 0, 0, 0.8)'
      : 'rgba(255, 255, 255, 0.8)'};
  font-size: 1rem;
  margin-top: 0;
  margin-bottom: 0.5rem;
  vertical-align: middle;

  span {
    color: ${props =>
      props.theme.light || props.light
        ? props.theme.background3.darken(0.5)
        : props.theme.background3.lighten(0.5)};
    font-size: 12px;
    margin-left: 0.5rem;
  }
`;

export const Link = styled.a`
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

  svg {
    margin-right: 10px;
  }

  &:disabled {
    background: ${props => props.theme.gray};
  }
`;

export const Action = Link.withComponent('button');

export const ButtonContainer = styled.section`
  display: flex;
  > *:not(:last-child) {
    margin-right: 0.5rem;
  }
`;

export const DeploysWrapper = styled.div`
  background: rgb(0, 0, 0);
  border-radius: 4px;
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.8);
  padding: 0.75rem 1rem;
  padding: 0.75rem 0rem;
  border-top-right-radius: 0;
  border-top-left-radius: 0;
  margin: 0.5rem 0.75rem;
  margin-top: 0;
`;

export const Wrapper = styled.div`
  opacity: 1;
  ${props =>
    props.loading &&
    css`
      opacity: 0.5;
      pointer-events: none;
    `};
`;
