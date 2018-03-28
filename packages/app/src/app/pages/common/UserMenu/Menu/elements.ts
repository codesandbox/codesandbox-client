import styled from 'app/styled-components';
import delayEffect from 'common/utils/animation/delay-effect';

export const Container = styled.div`
  position: absolute;
  background-color: ${props => props.theme.background2.darken(0.5)};
  box-shadow: 0px 3px 8px rgba(0, 0, 0, 0.75);

  ${delayEffect(0)};
  top: 40px;

  right: 0;

  min-width: 200px;

  z-index: 20;
`;

export const Item = styled.div`
  transition: 0.3s ease all;
  display: flex;
  align-items: center;
  font-size: 0.875rem;
  padding: 0.75rem 1rem;

  text-decoration: none;

  color: rgba(255, 255, 255, 0.8);
  border-left: 2px solid transparent;

  cursor: pointer;

  &:hover {
    border-color: ${props => props.theme.secondary};
    color: white;
    background-color: ${props => props.theme.secondary.clearer(0.9)};
  }
`;

export const Icon = styled.span`
  margin-right: 0.75rem;
`;
