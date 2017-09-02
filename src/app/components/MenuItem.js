import styled from 'styled-components';

export default styled.div`
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
