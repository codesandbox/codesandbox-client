import styled from 'styled-components';

export const Button = styled.button`
  display: flex;
  justify-content: space-between;
  transition: 0.3s ease all;
  width: 100%;
  height: 100%;
  outline: none;
  border: none;
  background-color: ${props => (props.active ? '#eee' : 'white')};
  padding: 1rem;
  color: rgba(0, 0, 0, 0.9);
  border-bottom: 1px solid #ddd;
  text-align: left;
  ${props => props.active && 'font-weight: 600'};
  cursor: ${props => (props.active ? 'default' : 'pointer')};

  &:hover {
    background-color: #eee;
  }
`;

export const Date = styled.div`
  color: rgba(0, 0, 0, 0.6);
`;
