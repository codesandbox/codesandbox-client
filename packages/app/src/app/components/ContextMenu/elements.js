import styled from 'styled-components';
import theme from 'common/theme';

export const Container = styled.div`
  position: fixed;

  font-size: 0.75rem;
  background-color: ${() => theme.background4()};
  color: rgba(255, 255, 255, 0.6);
  box-shadow: -1px 3px 4px rgba(0, 0, 0, 0.3);
  border-radius: 3px;
  z-index: 20;
  overflow: hidden;

  transform-origin: 0% 0%;
  font-weight: 600;
`;

export const Item = styled.div`
  transition: 0.2s ease all;
  display: flex;
  align-items: center;
  padding: 0.6rem 1rem;

  border-bottom: 1px solid ${() => theme.background2()};
  border-left: 2px solid transparent;
  cursor: pointer;

  min-width: 10rem;

  svg {
    margin-right: 0.75rem;
    font-size: 0.75rem;
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
