import styled from 'styled-components';

export const TemplatesGrid = styled.div`
  position: relative;
  overflow: hidden;
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  grid-auto-rows: 1fr;
`;
