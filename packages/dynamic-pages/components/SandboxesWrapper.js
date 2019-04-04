import styled from 'styled-components';

export default styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-column-gap: 24px;

  @media screen and (max-width: 700px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media screen and (max-width: 500px) {
    grid-template-columns: 1fr;
  }
`;
