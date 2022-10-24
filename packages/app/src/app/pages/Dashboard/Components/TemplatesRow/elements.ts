import styled from 'styled-components';

export const TemplatesGrid = styled.div`
  position: relative;
  overflow: hidden;
  display: grid;
  grid-template-columns: repeat(minmax(0, 1fr));
  gap: 16px;
`;
