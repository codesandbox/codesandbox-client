import styled from 'styled-components';

export const SubHeader = styled.h2`
  font-family: Inter;
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 19px;
  margin: 1rem 1.5rem;
  margin-top: 24px;
`;

export const Grid = styled.div`
  display: grid;
  margin: 0 1.5rem;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
`;

export const CenteredMessage = styled(SubHeader).attrs({ as: 'div' })`
  text-align: center;
  padding: 1rem;
`;
