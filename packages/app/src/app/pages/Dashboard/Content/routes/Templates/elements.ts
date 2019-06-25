import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding-left: 2rem;
`;

export const Grid = styled.section`
  padding-top: 2rem;
  display: grid;
  grid-gap: 32px;
  grid-template-columns: repeat(auto-fill, 212px);
`;
