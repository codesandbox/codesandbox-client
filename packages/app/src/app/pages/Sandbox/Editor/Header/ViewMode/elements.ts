import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  height: 100%;
  align-items: center;
  margin-left: 2rem;
  font-size: 0.75rem;
`;

export const ViewButton = styled.div`
  display: flex;
  align-items: center;
  padding: 4px 1rem;
  background-color: ${props => props.theme.secondary};
  color: white;
  font-weight: 400;
  border-radius: 4px;
  font-family: 'Poppins', sans-serif;

  svg {
    height: 100%;
  }
`;

export const Text = styled.span`
  display: block;
  margin: 0 0.5rem;
  margin-right: 0.75rem;
`;
