import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import Row from '../../components/flex/Row';
import delayEffect from '../../utils/animation/delay-effect';

const NavigationLink = styled(Link)`
  transition: 0.3s ease all;

  display: block;
  color: white;
  margin: 1.5rem 4rem;
  font-size: 1.25rem;
  font-weight: 300;
  text-shadow: 0px 2px 3px rgba(0, 0, 0, 0.3);
  color: ${props => (props.active ? 'white' : 'rgba(255, 255, 255, 0.5)')};
  text-decoration: none;

  ${delayEffect(0.2)}

  &:hover {
    color: white;
  }
`;

const CenteredRow = styled(Row)`
  width: 100%;
`;

export default () => (
  <CenteredRow alignItems="center" justifyContent="center">
    <NavigationLink to="/u/CompuIves/timeline">TIMELINE</NavigationLink>
    <NavigationLink to="/u/CompuIves" active>SHOWCASE</NavigationLink>
    <NavigationLink to="/u/CompuIves/sandboxes">SANDBOXES</NavigationLink>
  </CenteredRow>
);
