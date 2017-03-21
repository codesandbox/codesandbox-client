import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  transition: 0.3s ease all;
  position: relative;
  background-color: ${props => props.right ? props.theme.primary : props.theme.secondary};
  width: 3.5rem;
  color: rgba(0,0,0,0.5);
  border: 1px solid rgba(0,0,0,.1);
  padding: 0.5rem;
  height: 26px;
  box-sizing: border-box;
  cursor: pointer;
  border-radius: 4px;

  &:before, &:after {
    position: absolute;
    top: 50%;
    margin-top: -.5em;
    line-height: 1;
  }
`;

const Dot = styled.div`
  transition: inherit;
  position: absolute;
  height: 22px;
  width: 1rem;
  left: 0.2rem;
  border-radius: 4px;
  transform: translateX(${props => props.right ? 'calc(2rem + 2px)' : '0'});
  top: calc(0.1rem - 1px);
  background-color: white;
  box-shadow: 0 0 4px rgba(0,0,0,0.2);
`;

type Props = {
  right: boolean,
  onClick: () => void,
};

export default ({ right, onClick }: Props) => (
  <Container onClick={onClick} right={right}>
    <Dot right={right} />
  </Container>
);
