import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  transition: 0.3s ease all;
  position: relative;
  background-color: ${props => (props.right ? props.theme.primary : props.theme.secondary)};
  font-size: 1rem;
  width: 7rem;
  border-radius: 50px;
  font-size: .875rem;
  color: ${props => (props.right ? props.theme.primaryText : props.theme.secondary.darken(0.5))};
  border: 1px solid #ccc;
  padding: calc(0.5rem - 1px);
  height: 0.9rem;
  cursor: pointer;

  &:before, &:after {
    position: absolute;
    top: 50%;
    margin-top: -.5em;
    line-height: 1;
  }
`;

const Text = styled.span`
  position: absolute;
  ${props => props.position}: 0.75rem;
  opacity: ${props => (props.right ? 1 : 0)};
`;

const Dot = styled.div`
  transition: inherit;
  position: absolute;
  border-radius: 50%;
  height: 1.5rem;
  width: 1.5rem;
  left: 0.2rem;
  transform: translateX(${props => (props.right ? '4.2rem' : '0')});
  top: 0.1rem;
  background-color: ${props => (props.right ? props.theme.primaryText : props.theme.secondary.darken(0.5))};
  box-shadow: 0 0 4px ${props => (props.right ? props.theme.primaryText : props.theme.secondary.darken(0.5))};;
`;

type Props = {
  right: boolean;
  onClick: () => void;
};

export default ({ right, onClick }: Props) => (
  <Container onClick={onClick} right={right}>
    <Text right={right} position="left">Project</Text>
    <Text right={!right} position="right">Current</Text>
    <Dot right={right} />
  </Container>
);
