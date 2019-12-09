import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;

  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding-left: 2rem;
`;

export const Grid = styled.section`
  padding-top: 2rem;
  display: grid;
  grid-gap: 32px;
  grid-template-columns: repeat(auto-fill, 203.5px);

  height: auto;
  overflow-y: auto;
`;

export const EmptyTitle = styled.h2`
  font-size: 16px;
  line-height: 1.6;
  margin: 18px 0;
  width: 500px;

  color: rgba(255, 255, 255, 0.7);
`;
