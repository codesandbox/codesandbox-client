import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  margin-right: 2rem;
  align-items: center;

  @media (max-width: 1000px) {
    position: relative;
    right: 0;
    margin-top: 1rem;
  }
`;
