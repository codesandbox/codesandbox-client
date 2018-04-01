import styled from 'styled-components';
import theme from 'common/theme';

export const Container = styled.div`
  position: fixed;

  font-size: 0.875rem;
  background-color: ${() => theme.background2.lighten(0.2)()};
  color: ${() => theme.background2.lighten(3)()};
  box-shadow: -1px 3px 4px rgba(0, 0, 0, 0.3);
  border-radius: 3px;
  z-index: 20;
  overflow: hidden;

  transform-origin: 0% 0%;
`;

export const Item = styled.div`
  transition: 0.3s ease all;
  padding: 0.75rem 1rem;

  border-bottom: 1px solid ${() => theme.background2()};
  border-left: 2px solid transparent;
  cursor: pointer;

  min-width: 10rem;

  svg {
    margin-right: 0.5rem;
  }

  &:last-child {
    border-bottom-color: transparent;
  }

  &:hover {
    color: ${props => (props.color ? props.color : theme.secondary())};
    background-color: ${() => theme.background2.lighten(0.3)()};
    border-left-color: ${props =>
      props.color ? props.color : theme.secondary()};
  }
`;
