import styled from 'styled-components';

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
    background: ${props => {
      if (
        props.state === 'DEPLOYING' ||
        props.state === 'BUILDING' ||
        props.state === 'INITIALIZING'
      )
        return '#fccb7e';
      if (
        props.state === 'DEPLOYMENT_ERROR' ||
        props.state === 'BUILD_ERROR' ||
        props.state === 'ERROR'
      )
        return props.theme.red;
      if (props.state === 'BOOTED' || props.state === 'READY')
        return props.theme.green;
      if (props.state === 'FROZEN') return props.theme.blue;

      return props.theme.gray;
    }};
  }
`;

export const Name = styled.span`
  font-weight: 600;
  color: ${props =>
    props.theme.light ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)'};
  font-size: 1rem;
  margin-top: 0;
  margin-bottom: 0.5rem;
  vertical-align: middle;

  span {
    color: ${props =>
      props.theme.light
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
