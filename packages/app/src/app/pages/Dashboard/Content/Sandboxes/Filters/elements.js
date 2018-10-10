import styled from 'styled-components';

export const Container = styled.div`
  position: absolute;
  right: 2rem;
  top: 0;
  bottom: 0;
  display: flex;
  align-items: center;

  @media (max-width: 1000px) {
    position: relative;
    right: 0;
    margin-top: 1rem;
  }
`;
