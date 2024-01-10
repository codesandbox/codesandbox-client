import styled from 'styled-components';

export const Container = styled.div`
  > div {
    margin: 0.5rem 0;
  }

  &:first-child {
    margin-top: 0;
  }

  &:last-child {
    margin-bottom: 0;
  }
`;
