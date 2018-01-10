import styled from 'styled-components';

export const PlusIcon = styled.a`
  transition: 0.3s ease all;

  color: ${props => props.theme.secondary.clearer(0.2)};
  font-weight: 400;
  font-size: 1rem;
  text-decoration: none;
  cursor: pointer;
  text-align: center;

  display: flex;
  justify-content: center;
  align-items: center;

  width: 22px;
  height: 22px;
  border-radius: 4px;

  border: 1px solid ${props => props.theme.secondary.clearer(0.4)};

  &:hover {
    background-color: ${props => props.theme.secondary};
    color: white;
    border-color: transparent;
  }
`;
